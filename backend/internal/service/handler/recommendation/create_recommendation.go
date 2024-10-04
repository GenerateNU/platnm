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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	print(&req.Recommendation)
	print("media \n")
	print(req.Recommendation.MediaID)
	print("media \n")
	print(req.Recommendation.MediaType)
	print("id \n")
	print(req.Recommendation.RecommendeeId)
	print("id \n")
	print(req.Recommendation.RecommenderId)

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
