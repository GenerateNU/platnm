package spotify

import (
	"log/slog"
	"math"
	"platnm/internal/service/ctxt"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

const (
	maxSeveralArtists int = 50
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

	artists := make([]*spotify.FullArtist, 0, len(spotifyIds))
	var mu1 sync.Mutex
	var wg1 sync.WaitGroup
	batches := int(math.Ceil(float64(len(spotifyIds)) / float64(maxSeveralArtists)))

	for i := 0; i < batches; i++ {
		wg1.Add(1)
		go func(index int) {
			defer wg1.Done()
			result, err := client.GetArtists(c.Context(), spotifyIds[index*maxSeveralArtists:min((index+1)*maxSeveralArtists, len(spotifyIds))]...)
			if err != nil {
				slog.Warn("error fetching artist from spotify", "error", err.Error())
			}

			mu1.Lock()
			artists = append(artists, result...)
			mu1.Unlock()
		}(i)
	}

	wg1.Wait()

	updatedIds := make([]int, 0, len(artists))
	var mu2 sync.Mutex
	var wg2 sync.WaitGroup

	for _, artist := range artists {
		if len(artist.Images) == 0 {
			continue
		}

		wg2.Add(1)
		go func(a *spotify.FullArtist) {
			defer wg2.Done()
			id, err := h.mediaRepository.UpdateArtistPhoto(c.Context(), a.ID, a.Images[0].URL)
			if err != nil {
				slog.Warn("error updating artist photo", "error", err.Error())
				return
			}

			mu2.Lock()
			updatedIds = append(updatedIds, id)
			mu2.Unlock()
		}(artist)
	}

	wg2.Wait()

	return c.JSON(updatedIds)
}
