package reviews

import (
	"github.com/gofiber/fiber/v2"
	"platnm/internal/errs"
)

func (h *Handler) GetUserReviewOfTrack(c *fiber.Ctx) error {

	userId := c.Params("userId")
	mediaId := c.Params("mediaId")
	typeString := c.Query("media_type")

	if typeString != "track" {
		return errs.BadRequest("media id must be for a track, not an album.")
	}

	review, _ := h.reviewRepository.GetUserReviewOfTrack(c.Context(), mediaId, userId)

	if review == nil {
		return errs.BadRequest("user has no review for the specified id.")
	}

	return c.Status(fiber.StatusOK).JSON(review)
}
