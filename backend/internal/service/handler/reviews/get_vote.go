package reviews

import (
	"platnm/internal/errs"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetUserVote(c *fiber.Ctx, postType string) error {
	userID := c.Params("userID")
	postID := c.Params("postID")

	if userID == "" || postID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "userID and postID are required",
		})
	}

	exists, err := h.userRepository.UserExists(c.Context(), userID)

	if err != nil {
		return err
	}

	if !exists {
		return errs.NotFound("User", "id", userID)
	}

	if postType == "review" {
		print("review exists?")
		reviewExists, reviewExistsErr := h.reviewRepository.ReviewExists(c.Context(), postID)
		if reviewExistsErr != nil {
			print("review exists")
			return reviewExistsErr
		}

		if !reviewExists {
			print("review exists6")
			return errs.NotFound("Review", "id", postID)
		}
	} else {
		commentExists, commentExistsErr := h.reviewRepository.CommentExists(c.Context(), postID)
		if commentExistsErr != nil {
			return commentExistsErr
		}

		if !commentExists {
			return errs.NotFound("Comment", "id", postID)
		}
	}

	vote, err := h.voteRepository.GetVoteIfExists(c.Context(), userID, postID, postType)

	if vote == nil {
		return nil
	}

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(vote)
}
