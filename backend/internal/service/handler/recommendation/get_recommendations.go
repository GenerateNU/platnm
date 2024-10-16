package recommendation

import (
	"github.com/gofiber/fiber/v2"
	"platnm/internal/errs"
)

func (h *Handler) GetRecommendations(c *fiber.Ctx) error {
	var id = c.Params("id")
	exists, userErr := h.userRepository.UserExists(c.Context(), id)
	if userErr != nil {
		return userErr
	}
	if !exists {
		return errs.NotFound("User","id", id)
	}
	recommendations, err := h.recommendationRepository.GetRecommendations(c.Context(), id) 
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(recommendations)
}
