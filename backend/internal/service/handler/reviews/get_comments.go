package reviews

import (
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetComments(c *fiber.Ctx) error {
	id := c.Params("id")

	tags, err := h.reviewRepository.GetCommentsByReviewID(c.Context(), id)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(tags)
}
