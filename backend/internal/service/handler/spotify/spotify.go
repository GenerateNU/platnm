package spotify

import (
	"github.com/gofiber/fiber/v2"
)

type SpotifyHandler struct{}

func NewHandler() *SpotifyHandler {
	return &SpotifyHandler{}
}

func (h *SpotifyHandler) GetPlatnmPlaylist(c *fiber.Ctx) error {
	client, ok := getSpotifyCredentials(c)

	if ok != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Spotify client not found in context")
	}

	playlist, err := client.GetPlaylist(c.Context(), "671uu0Y7jiAgX04Ou82Up9")

	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(playlist)
}
