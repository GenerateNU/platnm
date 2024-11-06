package playlist

import (
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

type addToOnQueueRequest struct {
	models.Track
}


func (h *Handler) AddToUserOnQueue(c *fiber.Ctx) error {

	id := c.Params("userId")
	var req addToOnQueueRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	err := h.playlistRepository.AddToUserOnQueue(c.Context(), id, req.Track)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}
