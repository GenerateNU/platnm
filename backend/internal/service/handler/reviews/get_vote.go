package reviews

import (
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

	vote, err := h.voteRepository.GetVoteIfExists(c.Context(), userID, postID, postType)
	print(vote, err)

	if vote == nil {
		return nil
	}

	if err != nil {
		return err
	}

	print(vote)
	return c.Status(fiber.StatusOK).JSON(vote)
}
