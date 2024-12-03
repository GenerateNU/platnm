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
	maxSeveralTracks int = 50
)

func (h *SpotifyHandler) UpdatePreviewUrl(c *fiber.Ctx) error {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	trackIds, err := h.mediaRepository.GetTracksMissingPreviewUrl(c.Context())
	if err != nil {
		return err
	}

	tracks := make([]*spotify.FullTrack, 0, len(trackIds))
	var mu1 sync.Mutex
	var wg1 sync.WaitGroup
	batches := int(math.Ceil(float64(len(trackIds)) / float64(maxSeveralTracks)))

	for i := 0; i < batches; i++ {
		wg1.Add(1)
		go func(index int) {
			defer wg1.Done()
			result, err := client.GetTracks(c.Context(), trackIds[index*maxSeveralTracks:min((index+1)*maxSeveralTracks, len(trackIds))], spotify.Market("US"))
			if err != nil {
				slog.Warn("error fetching tracks from spotify", "error", err.Error())
				return
			}

			mu1.Lock()
			tracks = append(tracks, result...)
			mu1.Unlock()
		}(i)
	}

	wg1.Wait()

	updatedIds := make([]int, 0, len(tracks))
	var mu2 sync.Mutex
	var wg2 sync.WaitGroup

	for _, track := range tracks {
		if track == nil {
			continue
		}

		if track.PreviewURL == "" {
			continue
		}

		wg2.Add(1)
		go func(t *spotify.FullTrack) {
			defer wg2.Done()
			id, err := h.mediaRepository.UpdateTrackPreviewUrl(c.Context(), t.ID, t.PreviewURL)
			if err != nil {
				slog.Warn("error updating track preview url", "error", err.Error())
				return
			}

			mu2.Lock()
			updatedIds = append(updatedIds, id)
			mu2.Unlock()
		}(track)
	}

	wg2.Wait()

	return c.Status(fiber.StatusOK).JSON(updatedIds)
}
