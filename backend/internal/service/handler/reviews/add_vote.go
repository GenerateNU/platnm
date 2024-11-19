// package reviews

// import (
// 	"platnm/internal/errs"
// 	"platnm/internal/models"

// 	"github.com/gofiber/fiber/v2"
// )

// type createVoteRequest struct {
// 	models.UserVote
// }

// func (h *Handler) UserVote(c *fiber.Ctx, postType string) error {
// 	var req createVoteRequest

// 	if err := c.BodyParser(&req); err != nil {
// 		return errs.BadRequest("failed to parse request body")
// 	}

// 	exists, err := h.userRepository.UserExists(c.Context(), req.UserVote.UserID)

// 	if err != nil {
// 		return err
// 	}

// 	if !exists {
// 		return errs.NotFound("User", "id", &req.UserVote.UserID)
// 	}

// 	if postType == "review" {
// 		reviewExists, reviewExistsErr := h.reviewRepository.ReviewExists(c.Context(), req.UserVote.PostID)
// 		if reviewExistsErr != nil {
// 			return reviewExistsErr
// 		}

// 		if !reviewExists {
// 			return errs.NotFound("Review", "id", &req.UserVote.PostID)
// 		}
// 	} else {
// 		commentExists, commentExistsErr := h.reviewRepository.CommentExists(c.Context(), req.UserVote.PostID)
// 		if commentExistsErr != nil {
// 			return commentExistsErr
// 		}

// 		if !commentExists {
// 			return errs.NotFound("Comment", "id", &req.UserVote.PostID)
// 		}
// 	}

// 	voteValue, voteExistErr := h.voteRepository.GetVoteIfExists(c.Context(), req.UserVote.UserID, req.UserVote.PostID, postType)
// 	if voteExistErr != nil {
// 		return voteExistErr
// 	}

// 	if voteValue == nil {
// 		voteErr := h.voteRepository.AddVote(c.Context(), &req.UserVote, postType)
// 		if voteErr != nil {
// 			return voteErr
// 		}
// 	} else if req.UserVote.Upvote == voteValue.Upvote {
// 		delVoteErr := h.voteRepository.DeleteVote(c.Context(), req.UserVote.UserID, req.UserVote.PostID, postType)
// 		if delVoteErr != nil {
// 			return delVoteErr
// 		}
// 	} else {
// 		updateVoteErr := h.voteRepository.UpdateVote(c.Context(), req.UserVote.UserID, req.UserVote.PostID, req.UserVote.Upvote, postType)
// 		if updateVoteErr != nil {
// 			return updateVoteErr
// 		}
// 	}

// 	return c.Status(fiber.StatusOK).JSON(voteValue, postType)
// }

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
