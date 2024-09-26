package medias

import (
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetMediaByName(c *fiber.Ctx) error {
	
	name := c.Params("name")

	medias, _ := h.mediaRepository.GetMediaByName(c.Context(), name)
	print(medias)
	return c.Status(fiber.StatusOK).JSON(medias)
}
