package users

import (
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"

	//"platnm/internal/errs"
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


	// This code will work to error when a review is searched for with an id that does not exist at all.
	// If the id exists but there is no review for it, the error is handled inside reviewRepository.GetReviewsByUserID

	//user, err := h.userRepository.GetUserByID(c.Context(), id)

	// if err != nil {
	// 	return err
	// }

	// if user == nil {
	// 	return errs.NotFound("User", "id", id)
	// }

	review,err := h.reviewRepository.GetReviewsByUserID(c.Context(), id)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(review)
}
