package reviews

import (
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetUserFollowingReviewsOfMedia(c *fiber.Ctx) error {

	userId := c.Params("userId")
	mediaId := c.Params("mediaId")
	typeString := c.Query("media_type")

	review, _ := h.reviewRepository.GetUserFollowingReviewsOfMedia(c.Context(), typeString, mediaId, userId)

	return c.Status(fiber.StatusOK).JSON(review)
}
