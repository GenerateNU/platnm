package reviews

import (
	"platnm/internal/constants"
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

type createReviewRequest struct {
	models.Review
}

// CreateReview creates a review for a track or album.
// Handles both published reviews and drafts.
func (h *Handler) CreateReview(c *fiber.Ctx) error {
	var req createReviewRequest
	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	if errMap := req.validate(); len(errMap) > 0 {
		return errs.InvalidRequestData(errMap)
	}

	review, err := h.reviewRepository.CreateReview(c.Context(), &req.Review)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(review)
}

func (r *createReviewRequest) validate() map[string]string {
	var errs = make(map[string]string)

	if r.Rating < constants.MinimumRating || r.Rating > constants.MaximumRating {
		errs["rating"] = "rating must be between 1 and 10"
	}

	if r.MediaType != models.TrackMedia && r.MediaType != models.AlbumMedia {
		errs["media_type"] = "media_type must be either track or album"
	}
	return errs
}
