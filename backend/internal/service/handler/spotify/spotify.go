package spotify

import (
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
)

type SpotifyHandler struct {
	SpotifyRepository storage.SpotifyRepository
}

func NewHandler(spotifyRepository storage.SpotifyRepository) *SpotifyHandler {
	return &SpotifyHandler{
		spotifyRepository,
	}
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
