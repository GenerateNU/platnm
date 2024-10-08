package spotify

import (
	"platnm/internal/service/ctxt"
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
)

type SpotifyHandler struct {
	mediaRepository storage.MediaRepository
}

func NewHandler(mediaRepository storage.MediaRepository) *SpotifyHandler {
	return &SpotifyHandler{mediaRepository: mediaRepository}
}

func (h *SpotifyHandler) GetPlatnmPlaylist(c *fiber.Ctx) error {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	playlist, err := client.GetPlaylist(c.Context(), "671uu0Y7jiAgX04Ou82Up9")
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(playlist)
}
