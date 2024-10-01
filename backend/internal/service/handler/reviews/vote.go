package reviews

import (
	"github.com/gofiber/fiber/v2"
	"platnm/internal/models"
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

	reviewExists, reviewExistsErr := h.reviewRepository.ReviewExists(c.Context(),*req.UserReviewVote.ReviewID)
	if reviewExistsErr != nil {
		return reviewExistsErr
	}

	if !reviewExists {
		return errs.NotFound("Review", "id", &req.UserReviewVote.ReviewID)
	}

	voteExist, voteValue, voteExistErr := h.voteRepository.GetVoteIfExists(c.Context(), *req.UserReviewVote.UserID, req.UserReviewVote.ReviewID)
	if voteExistErr != nil {
		return voteExistErr
	}

	if !voteExist {
		vote, voteErr := h.voteRepository.AddVote(c.Context(), *req.UserReviewVote)
		if voteErr != nil {
			return voteErr
		}
	} else if *req.UserReviewVote.Upvote == voteValue {
		delVoteErr := h.voteRepository.DeleteVote(c.Context, *req.UserReviewVote.UserID, *req.UserReviewVote.ReviewID)
		if delVoteErr != nil {
			return delVoteErr
		}
	} else { 
		updateVoteErr := h.voteRepository.UpdateVote(c.Context, *req.UserReviewVote.UserID, *req.UserReviewVote.ReviewID, *req.UserReviewVote.Upvote)
		if updateVoteErr != nil {
			return updateVoteErr
		}
	}

	return c.Status(fiber.StatusOK).JSON(vote)
}
