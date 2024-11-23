package spotify

import (
	"log/slog"
	"platnm/internal/service/ctxt"
	"sync"

	"github.com/gofiber/fiber/v2"
)

func (h *SpotifyHandler) GetArtistDetails(c *fiber.Ctx) error {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	spotifyIds, err := h.mediaRepository.GetArtistsMissingPhoto(c.Context())
	if err != nil {
		return err
	}

	artists, err := client.GetArtists(c.Context(), spotifyIds...)
	if err != nil {
		return err
	}

	var updatedIds []int
	var mu sync.Mutex
	var wg sync.WaitGroup

	for _, artist := range artists {
		if len(artist.Images) == 0 {
			continue
		}

		wg.Add(1)
		go func() {
			defer wg.Done()
			id, err := h.mediaRepository.UpdateArtistPhoto(c.Context(), artist.ID, artist.Images[0].URL)
			if err != nil {
				slog.Warn("error updating artist photo", "error", err)
				return
			}

			mu.Lock()
			updatedIds = append(updatedIds, id)
			mu.Unlock()
		}()
	}

	wg.Wait()

	return c.JSON(updatedIds)
}
