package recommendation

import (
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

type RecommendationReaction struct {
	RecommendationID int    `json:"recommendation_id"`
	UserID           string `json:"user_id"`
	Reaction         bool   `json:"reaction"`
}

func (h *Handler) ReactToRecommendation(c *fiber.Ctx) error {

	rec_id := c.Params("id")
	recommendation, err := h.recommendationRepository.GetRecommendation(c.Context(), rec_id)

	reaction := RecommendationReaction{}

	if err != nil {
		return err
	}

	if recommendation == nil {
		return errs.NotFound("Recommendation", "id", rec_id)
	}

	// verify that the format of the request matches the review
	if err := c.BodyParser(&reaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// only the recommendee can react to the message
	if recommendation.RecommendeeId != reaction.UserID {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID does not match the recommendee ID."})
	}

	// making the updated recommendation with the new reaction
	updatedRecommendation := &models.Recommendation{
		ID:            recommendation.ID,
		MediaType:     recommendation.MediaType,
		MediaID:       recommendation.MediaID,
		RecommendeeId: recommendation.RecommendeeId,
		RecommenderId: recommendation.RecommenderId,
		Reaction:      &reaction.Reaction,
		CreatedAt:     recommendation.CreatedAt,
	}

	// change the reaction of the recommendation
	update_err := h.recommendationRepository.UpdateRecommendation(c.Context(), updatedRecommendation)

	if update_err != nil {
		return update_err
	}

	// send a stauts that everything is okay
	return c.SendStatus(fiber.StatusOK)

}
