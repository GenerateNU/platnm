package reviews

import (
	"fmt"
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

type createVoteRequest struct {
	models.UserVote
}

func (h *Handler) VoteReview(c *fiber.Ctx, postType string) error {
	var req createVoteRequest

	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}
	fmt.Printf("here: %+v, %+v\n", req, req.UserVote)

	fmt.Printf("user", req.UserVote.UserID)
	exists, err := h.userRepository.UserExists(c.Context(), req.UserVote.UserID)

	fmt.Printf("user exisits", exists)
	if err != nil {
		return err
	}

	if !exists {
		return errs.NotFound("User", "id", &req.UserVote.UserID)
	}

	fmt.Printf(postType)
	if postType == "review" {
		reviewExists, reviewExistsErr := h.reviewRepository.ReviewExists(c.Context(), req.UserVote.PostID)
		print("reviewExistsErr: ", reviewExistsErr)
		print(reviewExists)
		if reviewExistsErr != nil {
			return reviewExistsErr
		}

		if !reviewExists {
			return errs.NotFound("Review", "id", &req.UserVote.PostID)
		}
	} else {
		commentExists, commentExistsErr := h.reviewRepository.CommentExists(c.Context(), req.UserVote.PostID)
		if commentExistsErr != nil {
			return commentExistsErr
		}

		if !commentExists {
			return errs.NotFound("Comment", "id", &req.UserVote.PostID)
		}
	}

	println("here")
	voteValue, voteExistErr := h.voteRepository.GetVoteIfExists(c.Context(), req.UserVote.UserID, req.UserVote.PostID, postType)
	println("vote:", voteValue)
	println("vote:", voteExistErr)
	if voteExistErr != nil {
		print("erroring:")
		return voteExistErr
	}

	if voteValue == nil {
		voteErr := h.voteRepository.AddVote(c.Context(), &req.UserVote, postType)
		if voteErr != nil {
			return voteErr
		}
	} else if req.UserVote.Upvote == voteValue.Upvote {
		delVoteErr := h.voteRepository.DeleteVote(c.Context(), req.UserVote.UserID, req.UserVote.PostID, postType)
		if delVoteErr != nil {
			return delVoteErr
		}
	} else {
		updateVoteErr := h.voteRepository.UpdateVote(c.Context(), req.UserVote.UserID, req.UserVote.PostID, req.UserVote.Upvote, postType)
		if updateVoteErr != nil {
			return updateVoteErr
		}
	}

	return c.Status(fiber.StatusOK).JSON(voteValue, postType)
}
