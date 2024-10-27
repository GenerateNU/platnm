package spotify

import (
	"fmt"
	"log"
	"platnm/internal/errs"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

func fetchAlbumsFromSpotify(c *fiber.Ctx) (*spotify.SimpleAlbumPage, error) {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return &spotify.SimpleAlbumPage{}, err
	}

	limit := c.QueryInt("limit", 20)

	return client.NewReleases(c.Context(), spotify.Limit(limit))
}

func fetchTracksFromSpotify(c *fiber.Ctx, id spotify.ID) (*spotify.SimpleTrackPage, error) {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return &spotify.SimpleTrackPage{}, err
	}

	return client.GetAlbumTracks(c.Context(), id)
}

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
	// Query Spotify API based on media type
	switch mediaType {
	case models.AlbumMedia:
		spotifyAlbums, err := client.SearchAlbumByName(c.Context(), name, 5)
		if err != nil {
			log.Fatalf("Error searching for albums: %v", err)
		}
		fmt.Println("Albums:", albums)

		// Process each album result
		for _, album := range spotifyAlbums {
			wg.Add(1)
			go func(album spotify.SimpleAlbum) {
				defer wg.Done()
				if err := h.handleAlbum(c.Context(), &wg, album, albums, nil, errCh); err != nil {
					select {
					case errCh <- err:
					default:
					}
				}
			}(album)
			return c.Status(fiber.StatusOK).JSON(spotifyAlbums)
		}
	case models.TrackMedia:
		spotifyTracks, err := client.SearchTrackByName(c.Context(), name, 10)
		if err != nil {
			log.Fatalf("Error searching for tracks: %v", err)
		}
		fmt.Println("Tracks:", tracks)

		// Process each track result
		for _, track := range spotifyTracks {
			wg.Add(1)
			go func(track spotify.SimpleTrack) {
				defer wg.Done()
				if err := h.handleTrack(c.Context(), &wg, track, tracks, nil, errCh); err != nil {
					select {
					case errCh <- err:
					default:
					}
				}
			}(track)
			return c.Status(fiber.StatusOK).JSON(spotifyTracks)
		}
	default:
		return errs.InvalidRequestData(map[string]string{"media_type": "invalid media type"})
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
