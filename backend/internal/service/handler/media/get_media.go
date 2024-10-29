package media

import (
	"log"
	"platnm/internal/errs"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"platnm/internal/service/utils"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

func (h *Handler) GetMediaByName(c *fiber.Ctx) error {
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
	medias, _ := h.mediaRepository.GetMediaByName(c.Context(), name, mediaType)

	// If fewer than 5 results, call Spotify API for additional results
	if len(medias) < 5 {
		log.Println("Fetching additional results from Spotify API")
		err := h.searchAndHandleSpotifyMedia(c, name, mediaType)
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

func (h *Handler) GetMedia(c *fiber.Ctx) error {
	type request struct {
		utils.Pagination
		Sort string `query:"sort"`
	}

	var req request
	if err := c.QueryParser(&req); err != nil {
		return errs.BadRequest("invalid query parameters")
	}

	if errMap := req.Validate(); len(errMap) > 0 {
		return errs.InvalidRequestData(errMap)
	}

	switch req.Sort {
	case "recent":
		media, err := h.mediaRepository.GetMediaByDate(c.Context())
		if err != nil {
			return err
		}

		return c.Status(fiber.StatusOK).JSON(media)
	case "reviews":
		media, err := h.mediaRepository.GetMediaByReviews(c.Context(), req.Limit, req.GetOffset())
		if err != nil {
			return err
		}

		return c.Status(fiber.StatusOK).JSON(media)
	default:
		// if no sort query parameter is provided, default to some arbitrary sorting order
		media, err := h.mediaRepository.GetMediaByReviews(c.Context(), req.Limit, req.GetOffset())
		if err != nil {
			return err
		}

		return c.Status(fiber.StatusOK).JSON(media)
	}
}

// The updated searchAndHandleSpotifyMedia function
func (h *Handler) searchAndHandleSpotifyMedia(c *fiber.Ctx, name string, mediaType models.MediaType) error {
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
