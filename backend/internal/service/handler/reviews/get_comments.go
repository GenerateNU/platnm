package reviews

import (
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetComments(c *fiber.Ctx) error {
	id := c.Params("reviewid")

	comments, err := h.reviewRepository.GetCommentsByReviewID(c.Context(), id)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(comments)
}

func (h *Handler) GetCommentByCommentID(c *fiber.Ctx) error {
	id := c.Params("commentid")

	comment, err := h.reviewRepository.GetCommentByCommentID(c.Context(), id)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(comment)
}
