package playlist

import (
	"platnm/internal/models"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) CreatePlaylist(c *fiber.Ctx, playlist *models.Playlist) error {
	return fiber.ErrBadGateway
}
