package spotify

import (
	"platnm/internal/service/ctxt"

	"github.com/gofiber/fiber/v2"
)

func (h *SpotifyHandler) GetCurrentUserPlaylists(c *fiber.Ctx) error {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	playlists, err := client.CurrentUsersPlaylists(c.Context())
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(playlists)
}
