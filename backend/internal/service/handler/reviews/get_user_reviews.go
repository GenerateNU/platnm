package reviews

import (
	"github.com/gofiber/fiber/v2"

	"platnm/internal/errs"
)

func (h *Handler) GetReviewsByUserID(c *fiber.Ctx) error {

	id := c.Params("id")

	exists, err := h.userRepository.UserExists(c.Context(), id)

	if err != nil {
		return err
	}

	if !exists {
		return errs.NotFound("User", "id", id)
	}

	review, err := h.reviewRepository.GetReviewsByUserID(c.Context(), id)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(review)
}
