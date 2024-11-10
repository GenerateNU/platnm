package spotify

import (
	"platnm/internal/service/ctxt"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

func (h *SpotifyHandler) GetTopItems(c *fiber.Ctx) error {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	// need to unhard code this
	topTracks, err := client.CurrentUsersTopTracks(c.Context(), spotify.Limit(6))
	if err != nil {
		return err
	}

	topArtists, err := client.CurrentUsersTopArtists(c.Context(), spotify.Limit(9))
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"topTracks":  topTracks.Tracks,
		"topArtists": topArtists.Artists,
	})
}
