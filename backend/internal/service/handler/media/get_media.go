package media

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetMediaByName(c *fiber.Ctx) error {
	name := c.Params("name")
	medias, _ := h.mediaRepository.GetMediaByName(c.Context(), name)
	return c.Status(fiber.StatusOK).JSON(medias)
}

func (h *Handler) GetMediaByDate(c *fiber.Ctx) error {
	medias, _ := h.mediaRepository.GetMediaByDate(c.Context())
	fmt.Println("medias: ", medias)
	return c.Status(fiber.StatusOK).JSON(medias)
}
