package media

import (
	"context"
	"fmt"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

func (h *Handler) handleAlbum(ctx context.Context, wg *sync.WaitGroup, album spotify.SimpleAlbum, errCh chan<- error) error {
	albumId, err := h.mediaRepository.GetExistingAlbumBySpotifyID(ctx, album.ID.String())
	if err != nil {
		return err
	}

	if albumId != nil {
		return nil
	}

	addedAlbum, err := h.mediaRepository.AddAlbum(ctx, &models.Album{
		MediaType:   models.AlbumMedia,
		SpotifyID:   album.ID.String(),
		Title:       album.Name,
		ReleaseDate: album.ReleaseDateTime(),
		Cover:       album.Images[0].URL,
	})

	if err != nil {
		return err
	}

	for _, artist := range album.Artists {
		wg.Add(1)
		go func(artist spotify.SimpleArtist) {
			defer wg.Done()
			if err := h.handleArtist(ctx, artist, addedAlbum.ID); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

		}(artist)
	}

	return nil
}

func (h *Handler) handleArtist(ctx context.Context, artist spotify.SimpleArtist, albumId int) error {
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

func fetchAlbumTracksFromSpotify(c *fiber.Ctx, id spotify.ID) (*spotify.SimpleTrackPage, error) {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return &spotify.SimpleTrackPage{}, err
	}

	return client.GetAlbumTracks(c.Context(), id)
}

func (h *Handler) handleTracks(c *fiber.Ctx, wg *sync.WaitGroup, albumId int, spotifyID spotify.ID, errCh chan<- error) error {
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
						return
					}
					artistId = &newArtist.ID
				}
				fmt.Println("artistId: ", artist.Name, *artistId)
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
