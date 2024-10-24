package recommendation

import (
	"platnm/internal/errs"
	"platnm/internal/models"
	"github.com/gofiber/fiber/v2"
)

type createRecommendationRequest struct {
	models.Recommendation
}



func (h *Handler) CreateRecommendation(c *fiber.Ctx) error {
	var req createRecommendationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if errMap := req.validate(); len(errMap) > 0 {
		return errs.InvalidRequestData(errMap)
	}

	recommendation, err := h.recommendationRepository.CreateRecommendation(c.Context(), &req.Recommendation)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(recommendation)
}

func (r *createRecommendationRequest) validate() map[string]string {
	var errs = make(map[string]string)

	if r.MediaType != models.TrackMedia && r.MediaType != models.AlbumMedia {
		errs[string(r.MediaType)] = "media_type must be either track or album"
	}
	return errs
}
