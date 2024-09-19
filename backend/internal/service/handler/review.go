package handler

import (
	"fmt"
	"platnm/internal/errs"
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

func (h *ReviewHandler) GetReviewsByUserID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return errs.BadRequest(fmt.Errorf("received invalid ID. got %s", id))
	}
	user, err := h.reviewRepository.GetReviewsByUserID(c.Context(), id)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(user)
}
