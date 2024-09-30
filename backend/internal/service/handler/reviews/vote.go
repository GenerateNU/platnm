package reviews

import (
	"github.com/gofiber/fiber/v2"

	"platnm/internal/errs"
)

type createVoteRequest struct {
	models.UserReviewVote
}

func (h *Handler) VoteReview(c *fiber.Ctx) error {
	var req createVoteRequest
	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	exists, err := h.userRepository.UserExists(c.Context(), &req.UserReviewVote.UserID)
	if err != nil {
		return err
	}

	if !exists {
		return errs.NotFound("User", "id", &req.UserReviewVote.UserID)
	}
	exists, err := h.reviewRepository.ReviewExists(c.Context(),&req.UserReviewVote.ReviewID)
	if err != nil {
		return err
	}
	if !exists {
		return errs.NotFound("Review", "id", &req.UserReviewVote.ReviewID)
	}
	vote, err := h.voteRepository.AddVote(c.Context(), &req.UserReviewVote)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(vote)
}
