package media

import (
	"errors"
	"fmt"
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

	log.Println("mediaType", mediaType)
	log.Println("name", name)

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

func (h *Handler) searchAndHandleSpotifyMedia(c *fiber.Ctx, name string, mediaType models.MediaType) error {
	var (
		errCh = make(chan error, 1) // Buffered to capture one error
		wg    sync.WaitGroup
	)

	// Set search type based on media type
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

	if mediaType == models.AlbumMedia || mediaType == models.BothMedia {
		wg.Add(1)
		go func() {
			defer wg.Done()
			log.Println("Processing Spotify albums")
			if err := h.processSpotifyAlbums(c, &wg, result, errCh); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
		}()
	}

	if mediaType == models.TrackMedia || mediaType == models.BothMedia {
		wg.Add(1)
		go func() {
			defer wg.Done()
			log.Println("Processing Spotify tracks")
			if err := h.processSpotifyTracks(c, result, errCh, &wg); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
		}()
	}

	go func() {
		wg.Wait()
		close(errCh)
	}()

	var errs []error
	for err := range errCh {
		fmt.Println(err)
		errs = append(errs, err)
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	return nil
}

func (h *Handler) processSpotifyAlbums(c *fiber.Ctx, wg *sync.WaitGroup, result *spotify.SearchResult, errCh chan<- error) error {
	if result.Albums == nil {
		return nil
	}

	for _, album := range result.Albums.Albums {
		if err := h.handleAlbum(c.Context(), wg, album, errCh); err != nil {
			return err
		}
	}
	return nil
}

func (h *Handler) processSpotifyTracks(c *fiber.Ctx, result *spotify.SearchResult, errCh chan<- error, wg *sync.WaitGroup) error {
	if result.Tracks == nil {
		return nil
	}

	for _, track := range result.Tracks.Tracks {
		wg.Add(1)
		go func(track spotify.FullTrack) {
			defer wg.Done()
			album, err := h.mediaRepository.GetExistingAlbumBySpotifyID(c.Context(), track.Album.ID.String())
			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

			for album == nil {
				err = h.handleAlbum(c.Context(), wg, track.Album, errCh)
				if err != nil {
					select {
					case errCh <- err:
					default:
					}
				}

				album, err = h.mediaRepository.GetExistingAlbumBySpotifyID(c.Context(), track.Album.ID.String())
				if err != nil {
					select {
					case errCh <- err:
					default:
					}
				}
				// select {
				// case errCh <- fmt.Errorf("album not found for track: %s", track.Name):
				// default:
				// }
				// return
			}

			if err := h.handleTracks(c, wg, *album, track.Album.ID, errCh); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
		}(track)
	}
	return nil
}
