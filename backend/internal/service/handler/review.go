package handler

import (
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
)

type ReviewHandler struct {
	reviewRepository storage.ReviewRepository
}

func NewReviewHandler(reviewRepository storage.ReviewRepository) *ReviewHandler {
	return &ReviewHandler{
		reviewRepository,
	}
}

func (h*ReviewHandler) GetReviewsByUserID(c *fiber.Ctx) error {
	id := c.Params("id")
	user, err := h.reviewRepository.GetReviewsByUserID(id, c.Context())

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

