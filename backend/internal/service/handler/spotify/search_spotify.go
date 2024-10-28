package spotify

import (
	"log"
	"platnm/internal/errs"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

// The updated searchAndHandleSpotifyMedia function
func (h *SpotifyHandler) searchAndHandleSpotifyMedia(c *fiber.Ctx, name string, mediaType models.MediaType) error {
	var wg sync.WaitGroup
	errCh := make(chan error, 1) // Buffer of 1 to prevent blocking
	albums := make(chan models.Album)
	tracks := make(chan models.Track)

	// Close channels once all goroutines finish
	defer close(albums)
	defer close(tracks)
	defer close(errCh)

	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	// Determine the SearchType based on mediaType
	var searchType spotify.SearchType
	switch mediaType {
	case models.AlbumMedia:
		searchType = spotify.SearchTypeAlbum
	case models.TrackMedia:
		searchType = spotify.SearchTypeTrack
	default:
		return errs.InvalidRequestData(map[string]string{"media_type": "invalid media type"})
	}

	// Perform the search
	result, err := client.Search(c.Context(), name, searchType)
	if err != nil {
		log.Fatalf("Error searching Spotify: %v", err)
	}

	// Process albums or tracks based on search type
	switch mediaType {
	case models.AlbumMedia:
		if result.Albums != nil {
			for _, album := range result.Albums.Albums {
				wg.Add(1)
				go func(album spotify.SimpleAlbum) {
					defer wg.Done()
					if _, err := h.handleAlbum(c.Context(), &wg, album, albums, nil, errCh); err != nil {
						select {
						case errCh <- err:
						default:
						}
					}
				}(album)
			}
			return c.Status(fiber.StatusOK).JSON(result.Albums)
		}
	case models.TrackMedia:
		if result.Tracks != nil {
			for _, track := range result.Tracks.Tracks {
				wg.Add(1)
				go func(track spotify.FullTrack) {
					defer wg.Done()
					album, albumErr := h.mediaRepository.GetExistingAlbumBySpotifyID(c.Context(), track.Album.ID.String())
					if albumErr != nil {
						select {
						case errCh <- albumErr:
						default:
						}
						return
					}
					if err := h.handleTracks(c, &wg, *album, track.Album.ID, tracks, nil); err != nil {
						select {
						case errCh <- err:
						default:
						}
					}
				}(track)
			}
			return c.Status(fiber.StatusOK).JSON(result.Tracks)
		}
	}

	wg.Wait()

	// Check for errors from goroutines
	select {
	case err := <-errCh:
		return err
	default:
		return nil
	}
}
