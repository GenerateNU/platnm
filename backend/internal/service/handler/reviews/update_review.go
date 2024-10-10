package reviews

import (
	"github.com/gofiber/fiber/v2"
	"platnm/internal/models"
	"strconv"
	"time"

	"platnm/internal/constants"
	"platnm/internal/errs"
)

type ReviewUpdate struct {
	ID      int     `json:"id"`
	UserID  string  `json:"user_id"`
	Rating  *int    `json:"rating"`
	Comment *string `json:"comment"`
}

func (h *Handler) UpdateReviewByReviewID(c *fiber.Ctx) error {

	reviewIDStr := c.Params("id")

	// Convert the string reviewID to an integer
	reviewID, err := strconv.Atoi(reviewIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid review ID"})
	}

	existingReview, err := h.reviewRepository.GetExistingReview(c.Context(), reviewIDStr)
	reviewUpdate := ReviewUpdate{}

	if err != nil {
		return err
	}

	if existingReview == nil {
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

	updateRating := reviewUpdate.Rating != nil
	updateComment := reviewUpdate.Comment != nil

	if !updateRating && updateComment {
		existingReview = &models.Review{
			ID:        reviewID,
			UserID:    reviewUpdate.UserID,
			Comment:   *reviewUpdate.Comment,
			UpdatedAt: time.Now(),
		}
	} else {
		// updateRating guaranteed because of validation that !updateRating && !updateComment -> error
		if *reviewUpdate.Rating > constants.MaximumRating || *reviewUpdate.Rating < constants.MinimumRating {
			return errs.BadRequest("Rating must be between 1 and 10 [1, 10]")
		}
		if !updateComment && updateRating {
			existingReview = &models.Review{
				ID:        reviewID,
				UserID:    reviewUpdate.UserID,
				Rating:    *reviewUpdate.Rating,
				UpdatedAt: time.Now(),
			}
		} else { //if updateComment && updateRating
			existingReview = &models.Review{
				ID:        reviewID,
				UserID:    reviewUpdate.UserID,
				Rating:    *reviewUpdate.Rating,
				Comment:   *reviewUpdate.Comment,
				UpdatedAt: time.Now(),
			}
		}
	}

	// Update the review in the database
	returnedReview, err := h.reviewRepository.UpdateReview(c.Context(), existingReview)
	if err != nil {
		return err
	}

	// Return the updated review as JSON
	return c.Status(fiber.StatusOK).JSON(returnedReview)
}
