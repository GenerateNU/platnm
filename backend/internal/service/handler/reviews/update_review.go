package reviews

import (
	"github.com/gofiber/fiber/v2"
	"strconv"
	"time"

	"platnm/internal/errs"

	"platnm/internal/models"
)

type ReviewUpdate struct {
	ID        int       `json:"id"`
	UserID    string    `json:"user_id"`
	Rating    *int      `json:"rating"`
	Comment   *string   `json:"comment"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (h *Handler) UpdateReviewByReviewID(c *fiber.Ctx) error {

	reviewIDStr := c.Params("id")

	// Convert the string reviewID to an integer
	reviewID, err := strconv.Atoi(reviewIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid review ID"})
	}

	exists, err := h.reviewRepository.ReviewExists(c.Context(), reviewIDStr)
	reviewUpdate := ReviewUpdate{}

	if err != nil {
		return err
	}

	if !exists {
		return errs.NotFound("Review", "id", reviewID)
	}

	// Validate the body of the request matches the form of ReviewUpdate
	if err := c.BodyParser(&reviewUpdate); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Get all reviews for the user
	reviews, err := h.reviewRepository.GetReviewsByUserID(c.Context(), reviewUpdate.UserID)
	if err != nil {
		return err
	}

	print("here\n")
	print(len(reviews))
	print("\n")

	// Flag to check if the review exists and belongs to the user
	var existingReview *models.Review

	// Iterate over the user's reviews to find the review with the given reviewID
	for _, review := range reviews {
		print("\n")
		print(review.ID)
		print("\n")
		if review.ID == reviewID {
			existingReview = review
			break
		}
	}

	// If no review is found, return not found error
	if existingReview == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Review not found or does not belong to the user"})
	}

	// Update the fields if provided
	if reviewUpdate.Comment != nil {
		existingReview.Comment = *reviewUpdate.Comment
	}
	if reviewUpdate.Rating != nil {
		existingReview.Rating = *reviewUpdate.Rating
	}

	// Update the `updatedAt` field
	existingReview.UpdatedAt = time.Now()

	// Update the review in the database
	updatedReview, err := h.reviewRepository.UpdateReview(c.Context(), existingReview)
	if err != nil {
		return err
	}

	// Return the updated review as JSON
	return c.Status(fiber.StatusOK).JSON(updatedReview)
}
