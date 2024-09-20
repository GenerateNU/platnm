package reviews

import (
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

type CreateReviewRequest struct {
	models.Review
}

func (h *Handler) CreateReview(c *fiber.Ctx) error {
	var req CreateReviewRequest
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

func (r *CreateReviewRequest) validate() map[string]string {
	var errs = make(map[string]string)

	if r.Rating < 1 || r.Rating > 10 {
		errs["rating"] = "rating must be between 1 and 10"
	}

	if r.MediaType != models.Track && r.MediaType != models.Album {
		errs["media_type"] = "media_type must be either track or album"
	}
	return errs
}
