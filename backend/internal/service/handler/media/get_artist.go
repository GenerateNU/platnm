package media

import (
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetMediaArtist(c *fiber.Ctx) error {

	mediaID := c.Params("mediaId")
	typeString := c.Query("media_type")

	var mediaType models.MediaType

	switch typeString {
	case "album":
		mediaType = models.AlbumMedia
	case "track":
		mediaType = models.TrackMedia
	}

	artist, _ := h.mediaRepository.GetMediaArtist(c.Context(), mediaID, mediaType)
	return c.Status(fiber.StatusOK).JSON(artist)

}
