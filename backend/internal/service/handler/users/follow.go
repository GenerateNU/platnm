package users

import (
	"platnm/internal/errs"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type FollowRequest struct {
	FollowerId  uuid.UUID `json:"follower_id"`
	FollowingId uuid.UUID `json:"following_id"`
}

func (h *Handler) FollowUnfollowUser(c *fiber.Ctx) error {
	var body FollowRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	followerStr := body.FollowerId.String()
	followingStr := body.FollowingId.String()

	// Get the current user ID (inferred from session, authentication middleware)
	// currentUserId := c.Locals("userId").(string)
	follower, err := h.userRepository.UserExists(c.Context(), followerStr)
	if err != nil || !follower {
		return errs.NotFound("Follower", "id", followerStr)
	}
	following, err := h.userRepository.UserExists(c.Context(), followingStr)
	if err != nil || !following {

		return errs.NotFound("Followee", "id", followingStr)
	}

	// Check if the current user is already following the target user
	isFollowing, err := h.userRepository.FollowExists(c.Context(), body.FollowerId, body.FollowingId)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Failed to check follow status",
		})
	}

	if isFollowing {
		// Unfollow user
		success, err := h.userRepository.UnFollow(c.Context(), body.FollowerId, body.FollowingId)
		if err != nil || !success {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to unfollow user",
			})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Unfollowed successfully",
		})
	} else {
		// Follow user
		success, err := h.userRepository.Follow(c.Context(), body.FollowerId, body.FollowingId)
		if err != nil || !success {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to follow user",
			})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Followed successfully",
		})
	}
}
