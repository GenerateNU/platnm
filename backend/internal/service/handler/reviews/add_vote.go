package reviews

import (
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

type createVoteRequest struct {
	models.UserVote
}

func (h *Handler) UserVote(c *fiber.Ctx, postType string) error {
	var req createVoteRequest

	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	voteExistErr := h.reviewRepository.UserVote(c.Context(), req.UserVote.UserID, req.UserVote.PostID, req.UserVote.Upvote, postType)

	if voteExistErr != nil {
		return voteExistErr
	}

	return c.Status(fiber.StatusOK).JSON(req)
}
