package handler

import (
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
	// bind request body to review
	if err := c.BodyParser(&review); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if errs := review.Validate(); len(errs) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"errors": errs})
	}

	if _, err := h.reviewRepository.CreateReview(c.Context(), &review); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// return review in response
	return c.Status(fiber.StatusCreated).JSON(review)
}
