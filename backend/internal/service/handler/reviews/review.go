package reviews

import (
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"

	"platnm/internal/errs"
)

type ReviewHandler struct {
	reviewRepository storage.ReviewRepository
	userRepository storage.UserRepository
}

func NewReviewHandler(reviewRepository storage.ReviewRepository, userRepository storage.UserRepository) *ReviewHandler {
	return &ReviewHandler{
		reviewRepository,
		userRepository,
	}
}

func (h *ReviewHandler) GetReviewsByUserID(c *fiber.Ctx) error {

	id := c.Params("id")

	exists, err := h.reviewRepository.UserExists(c.Context(), id)

	if err != nil {
		return err 
	}

	if !exists {
		return errs.NotFound("User", "id", id)
	}

	review,err := h.reviewRepository.GetReviewsByUserID(c.Context(), id)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(review)
}
