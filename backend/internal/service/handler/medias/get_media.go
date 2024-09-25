package medias

import (
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetMediaByName(c *fiber.Ctx) error {

	// TODO: CHECK THAT THIS IS CORRECT
	
	name := c.Params("name")

	medias, _ := h.mediaRepository.GetMediaByName(c.Context(), name)

	return c.Status(fiber.StatusOK).JSON(medias)
}
