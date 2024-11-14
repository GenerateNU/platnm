package spotify

import (
	"context"
	"errors"
	"fmt"
	"log"
	"log/slog"
	"platnm/internal/errs"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

func (h *SpotifyHandler) GetMediaByName(c *fiber.Ctx) error {
	name := c.Params("name")
	typeString := c.Query("media_type")

	var mediaType models.MediaType

	switch typeString {
	case "album":
		mediaType = models.AlbumMedia
	case "track":
		mediaType = models.TrackMedia
	case "":
		mediaType = models.BothMedia
	}

	medias, err := h.mediaRepository.GetMediaByName(c.Context(), name, mediaType)
	if err != nil {
		log.Println("Error fetching media by name:", err)
		return errs.InternalServerError()
	}

	// If fewer than 5 results, call Spotify API for additional results
	if len(medias) < 5 {
		log.Println("Fetching additional results from Spotify API")
		err = h.searchAndHandleSpotifyMedia(c, name, mediaType)
		if err != nil {
			log.Println("Spotify API error:", err)
			return errs.InternalServerError()
		}

		log.Println("Done fetching results from Spotify API")

		// Re-fetch all media, including new entries from Spotify
		medias, err = h.mediaRepository.GetMediaByName(c.Context(), name, mediaType)
		if err != nil {
			return errs.InternalServerError()
		}
	}

	fmt.Println("medias", medias)
	return c.Status(fiber.StatusOK).JSON(medias)
}

func (h *SpotifyHandler) searchAndHandleSpotifyMedia(c *fiber.Ctx, name string, mediaType models.MediaType) error {
	var searchType spotify.SearchType
	switch mediaType {
	case models.AlbumMedia:
		searchType = spotify.SearchTypeAlbum
	case models.TrackMedia:
		searchType = spotify.SearchTypeTrack
	case models.BothMedia:
		searchType = spotify.SearchTypeAlbum | spotify.SearchTypeTrack
	default:
		return errs.InvalidRequestData(map[string]string{"media_type": "invalid media type"})
	}

	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	result, err := client.Search(c.Context(), name, searchType, spotify.Limit(20))
	if err != nil {
		return errs.InternalServerError()
	}

	resp := h.handleSearchResults(c, result)
	return c.Status(fiber.StatusOK).JSON(resp)
}

func (h *SpotifyHandler) handleSearchResults(ctx *fiber.Ctx, result *spotify.SearchResult) error {
	var wg sync.WaitGroup
	var errCh = make(chan error, 100)

	for _, album := range result.Albums.Albums {
		wg.Add(1)
		go func() {
			defer wg.Done()
			albumId, err := h.handleSearchAlbum(ctx.Context(), &wg, album, errCh)
			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

			err = h.handleSearchTracks(ctx, &wg, *albumId, album.ID, errCh)
			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
		}()

	}

	wg.Wait()
	close(errCh)

	var allErrs []error
	go func() {
		for err := range errCh {
			allErrs = append(allErrs, err)
		}
	}()

	if len(allErrs) > 0 {
		slog.Warn("error importing recommendations",
			"errors", errors.Join(allErrs...),
		)
	}

	return nil
}

func (h *SpotifyHandler) handleSearchAlbum(ctx context.Context, wg *sync.WaitGroup, album spotify.SimpleAlbum, errCh chan<- error) (*int, error) {
	albumId, err := h.mediaRepository.GetExistingAlbumBySpotifyID(ctx, album.ID.String())
	if err != nil {
		return nil, err
	}

	if albumId != nil {
		return albumId, nil
	}

	fmt.Println("Adding album", album.Name)
	addedAlbum, err := h.mediaRepository.AddAlbum(ctx, &models.Album{
		MediaType:   models.AlbumMedia,
		SpotifyID:   album.ID.String(),
		Title:       album.Name,
		ReleaseDate: album.ReleaseDateTime(),
		Cover:       album.Images[0].URL,
	})
	if err != nil {
		return nil, err
	}

	for _, artist := range album.Artists {
		wg.Add(1)
		go func(artist spotify.SimpleArtist) {
			defer wg.Done()
			if err := h.handleSearchArtist(ctx, artist, addedAlbum.ID); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

		}(artist)
	}

	return &addedAlbum.ID, nil

}

func (h *SpotifyHandler) handleSearchArtist(ctx context.Context, artist spotify.SimpleArtist, albumId int) error {
	/* TODO: it's possible that the artist can exist but not be detected by spotifyID lookup if it was
	created through a future analogous Apple Music pathway.
	we need more sophisticated artist search logic, but are limited by the overlap betweem the two APIs.
	the only 100% shared data point is the artist name, which is not unique, posing a problem.
	for now, we'll just create a new artist if one doesn't exist */
	artistId, err := h.mediaRepository.GetExistingArtistBySpotifyID(ctx, artist.ID.String())
	if err != nil {
		return err
	}
	if artistId == nil {
		newArtist, err := h.mediaRepository.AddArtist(ctx, &models.Artist{
			SpotifyID: artist.ID.String(),
			Name:      artist.Name,
		})
		if err != nil {
			return err
		}
		artistId = &newArtist.ID
	}

	if err := h.mediaRepository.AddAlbumArtist(ctx, albumId, *artistId); err != nil {
		return err
	}

	return nil
}

func (h *SpotifyHandler) fetchAlbumTracksFromSpotify(c *fiber.Ctx, id spotify.ID) (*spotify.SimpleTrackPage, error) {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return &spotify.SimpleTrackPage{}, err
	}

	return client.GetAlbumTracks(c.Context(), id)
}

func (h *SpotifyHandler) handleSearchTracks(c *fiber.Ctx, wg *sync.WaitGroup, albumId int, spotifyID spotify.ID, errCh chan<- error) error {
	spotifyTracks, err := fetchAlbumTracksFromSpotify(c, spotifyID)
	if err != nil {
		return err
	}

	for _, t := range spotifyTracks.Tracks {
		wg.Add(1)
		go func(t spotify.SimpleTrack) {
			defer wg.Done()

			trackResult, err := h.mediaRepository.AddTrack(c.Context(), &models.Track{
				SpotifyID: t.ID.String(),
				AlbumID:   albumId,
				Title:     t.Name,
				Duration:  int(t.Duration / 1000)})

			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

			// get the Spotify artists associated with this track and add a record for each
			for _, artist := range t.Artists {
				artistId, err := h.mediaRepository.GetExistingArtistBySpotifyID(c.Context(), artist.ID.String())
				if err != nil {
					select {
					case errCh <- err:
					default:
					}
				}

				if artistId == nil {
					newArtist, err := h.mediaRepository.AddArtist(c.Context(), &models.Artist{
						SpotifyID: artist.ID.String(),
						Name:      artist.Name,
					})
					if err != nil {
						select {
						case errCh <- err:
						default:
						}
					}
					artistId = &newArtist.ID
				}
				err = h.mediaRepository.AddTrackArtist(c.Context(), trackResult.ID, *artistId)
				if err != nil {
					select {
					case errCh <- err:
					default:
					}
				}
			}
		}(t)
	}
	return nil
}
