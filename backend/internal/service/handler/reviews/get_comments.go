package reviews

import (
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetComments(c *fiber.Ctx) error {
	tags, err := h.reviewRepository.GetCommentsByReviewID(c.Context())

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(tags)
}
