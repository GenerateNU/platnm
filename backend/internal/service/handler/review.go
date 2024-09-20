package handler

import (
	"platnm/internal/errs"
	"platnm/internal/models"
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

func (h *ReviewHandler) CreateReview(c *fiber.Ctx) error {
	var review models.Review
	if err := c.BodyParser(&review); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	if errMap := review.Validate(); len(errMap) > 0 {
		return errs.InvalidRequestData(errMap)
	}

	if _, err := h.reviewRepository.CreateReview(c.Context(), &review); err != nil {
		return err
	}

	// return review in response
	return c.Status(fiber.StatusCreated).JSON(review)
}
