package recommendation

import (
	"platnm/internal/errs"
	"platnm/internal/models"
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
)

type createRecommendationRequest struct {
	models.Recommendation
}

type Handler struct {
	recommendationRepository storage.RecommendationRepository
}

func NewHandler(recommendationRepository storage.RecommendationRepository) *Handler {
	return &Handler{
		recommendationRepository,
	}
}

func (h *Handler) CreateRecommendation(c *fiber.Ctx) error {
	var req createRecommendationRequest
	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	if errMap := req.validate(); len(errMap) > 0 {
		return errs.InvalidRequestData(errMap)
	}

	review, err := h.recommendationRepository.CreateRecommendation(c.Context(), &req.Recommendation)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(review)
}

func (r *createRecommendationRequest) validate() map[string]string {
	return nil
}
