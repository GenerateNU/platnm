package spotistics

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
	client := WithSpotify()

	playlist, err := client.GetPlaylist(c.Context(), "671uu0Y7jiAgX04Ou82Up9")

	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(playlist)
}
