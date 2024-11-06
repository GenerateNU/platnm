package reviews

import (
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetTags(c *fiber.Ctx) error {

	tags, err := h.reviewRepository.GetTags(c.Context())

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(tags)
}
