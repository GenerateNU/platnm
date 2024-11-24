package reviews

import (
	"github.com/gofiber/fiber/v2"
	"platnm/internal/errs"
)

func (h *Handler) GetUserReviewsOfMedia(c *fiber.Ctx) error {

	userId := c.Params("userId")
	mediaId := c.Params("mediaId")
	typeString := c.Query("media_type")

	review, _ := h.reviewRepository.GetUserReviewsOfMedia(c.Context(), typeString, mediaId, userId)

	if review == nil {
		return errs.BadRequest("user has no review for the specified id.")
	}

	return c.Status(fiber.StatusOK).JSON(review)
}
