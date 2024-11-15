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

		// Re-fetch all media, including new entries from Spotify
		medias, err = h.mediaRepository.GetMediaByName(c.Context(), name, mediaType)
		if err != nil {
			return errs.InternalServerError()
		}
	}

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

	result, err := client.Search(c.Context(), name, searchType, spotify.Limit(10))

	fmt.Println("result: ", result)
	if err != nil {
		return errs.InternalServerError()
	}

	resp := h.handleSearchResults(client, c.Context(), result)
	return c.Status(fiber.StatusOK).JSON(resp)
}

func (h *SpotifyHandler) handleSearchResults(client *spotify.Client, ctx context.Context, result *spotify.SearchResult) error {
	var wg sync.WaitGroup
	var errCh = make(chan error, 100)

	for _, album := range result.Albums.Albums {
		wg.Add(1)
		go func() {
			defer wg.Done()
			albumId := h.handleSearchAlbum(ctx, &wg, album, errCh)
			h.handleSearchTracks(client, ctx, &wg, *albumId, album.ID, errCh)
		}()
	}

	for _, track := range result.Tracks.Tracks {
		wg.Add(1)
		go func() {
			defer wg.Done()
			h.handleSearchTrack(ctx, &wg, &track, errCh)
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

func (h *SpotifyHandler) handleSearchAlbum(ctx context.Context, wg *sync.WaitGroup, album spotify.SimpleAlbum, errCh chan<- error) *int {
	albumId, err := h.mediaRepository.GetExistingAlbumBySpotifyID(ctx, album.ID.String())
	if err != nil {
		select {
		case errCh <- err:
		default:
		}
		return nil
	}

	if albumId != nil {
		return albumId
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
		select {
		case errCh <- err:
		default:
		}
		return nil
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

	return &addedAlbum.ID

}

func (h *SpotifyHandler) handleSearchArtist(ctx context.Context, spotifyArtist spotify.SimpleArtist, albumId int) error {
	/* TODO: it's possible that the artist can exist but not be detected by spotifyID lookup if it was
	created through a future analogous Apple Music pathway.
	we need more sophisticated artist search logic, but are limited by the overlap betweem the two APIs.
	the only 100% shared data point is the artist name, which is not unique, posing a problem.
	for now, we'll just create a new artist if one doesn't exist */
	artist := &models.Artist{
		SpotifyID: spotifyArtist.ID.String(),
		Name:      spotifyArtist.Name,
	}

	_, err := h.mediaRepository.AddArtistAndAlbumArtist(ctx, artist, albumId)
	if err != nil {
		return err
	}

	return nil
}

func (h *SpotifyHandler) handleSearchTracks(client *spotify.Client, ctx context.Context, wg *sync.WaitGroup, albumId int, spotifyID spotify.ID, errCh chan<- error) error {
	spotifyTracks, err := client.GetAlbumTracks(ctx, spotifyID)
	if err != nil {
		return err
	}

	for _, t := range spotifyTracks.Tracks {
		wg.Add(1)
		go func(t spotify.SimpleTrack) {
			defer wg.Done()

			_, err := h.mediaRepository.AddTrack(ctx, &models.Track{
				SpotifyID: t.ID.String(),
				AlbumID:   albumId,
				Title:     t.Name,
				Duration:  int(t.Duration),
			})

			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
		}(t)
	}
	return nil
}

func (h *SpotifyHandler) handleSearchTrack(ctx context.Context, wg *sync.WaitGroup, track *spotify.FullTrack, errCh chan<- error) {
	addedAlbum, err := h.mediaRepository.AddAlbum(ctx, &models.Album{
		MediaType:   models.AlbumMedia,
		SpotifyID:   track.Album.ID.String(),
		Title:       track.Album.Name,
		ReleaseDate: track.Album.ReleaseDateTime(),
		Cover:       track.Album.Images[0].URL,
	})
	if err != nil {
		select {
		case errCh <- err:
		default:
		}
		return
	}

	for _, artist := range track.Album.Artists {
		wg.Add(1)
		go func(artist spotify.SimpleArtist) {
			defer wg.Done()
			_, err := h.mediaRepository.AddArtistAndAlbumArtist(ctx, &models.Artist{
				SpotifyID: track.Album.Artists[0].ID.String(),
				Name:      track.Album.Artists[0].Name,
			}, addedAlbum.ID)
			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

		}(artist)
	}
	h.mediaRepository.AddArtistAndAlbumArtist(ctx, &models.Artist{
		SpotifyID: track.Album.Artists[0].ID.String(),
		Name:      track.Album.Artists[0].Name,
	}, addedAlbum.ID)

	addedTrack, err := h.mediaRepository.AddTrack(ctx, &models.Track{
		SpotifyID: track.ID.String(),
		AlbumID:   addedAlbum.ID,
		Title:     track.Name,
		Duration:  int(track.Duration / 1000)})

	if err != nil {
		select {
		case errCh <- err:
		default:
		}
		return
	}

	// get the Spotify artists associated with this track and add a record for each
	for _, spotifyArtist := range track.Artists {
		artist := &models.Artist{
			SpotifyID: spotifyArtist.ID.String(),
			Name:      spotifyArtist.Name,
		}

		h.mediaRepository.AddArtistAndTrackArtist(ctx, artist, addedTrack.ID)
	}
}
