package spotistics

import (
	"context"
	"log"
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
	client := clientcreds()

	playlist, err := client.GetPlaylist(context.Background(), "671uu0Y7jiAgX04Ou82Up9")

	if err != nil {
		log.Fatalf("error retrieve playlist data: %v", err)
	}
	return c.Status(fiber.StatusOK).JSON(playlist)
}
