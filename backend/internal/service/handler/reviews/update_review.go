package reviews

import (
	"github.com/gofiber/fiber/v2"
	"platnm/internal/models"
	"strconv"
	"time"

	"platnm/internal/errs"
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

	// Ensure at least one field is being updated
	if reviewUpdate.Comment == nil && reviewUpdate.Rating == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Either 'comment' or 'rating' must be provided"})
	}

	userID := reviewUpdate.UserID
	reviewIsOwnedByUser, err := h.reviewRepository.ReviewBelongsToUser(c.Context(), reviewIDStr, userID)

	if err != nil {
		return err
	}

	if !reviewIsOwnedByUser {
		// If no rows are returned, the review doesn't belong to the user
		return errs.BadRequest("This user does not own the specified review.")
	}

	var updatedReview models.Review
	updateRating := reviewUpdate.Rating != nil
	updateComment := reviewUpdate.Comment != nil

	if !updateRating {
		updatedReview = models.Review{
			ID:        reviewID,
			UserID:    reviewUpdate.UserID,
			Comment:   *reviewUpdate.Comment,
			UpdatedAt: time.Now(),
		}
	} else if !updateComment {
		if *reviewUpdate.Rating > 10 || *reviewUpdate.Rating < 0 {
			return errs.BadRequest("Rating must be between 0 and 10")
		}
		updatedReview = models.Review{
			ID:        reviewID,
			UserID:    reviewUpdate.UserID,
			Rating:    *reviewUpdate.Rating,
			UpdatedAt: time.Now(),
		}
	} else {
		updatedReview = models.Review{
			ID:        reviewID,
			UserID:    reviewUpdate.UserID,
			Rating:    *reviewUpdate.Rating,
			Comment:   *reviewUpdate.Comment,
			UpdatedAt: time.Now(),
		}
	}

	// Update the review in the database
	returnedReview, err := h.reviewRepository.UpdateReview(c.Context(), &updatedReview, updateComment, updateRating)
	if err != nil {
		return err
	}

	// Return the updated review as JSON
	return c.Status(fiber.StatusOK).JSON(returnedReview)
}
