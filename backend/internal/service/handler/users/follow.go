package users

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type FollowRequest struct {
	FollowerId  string `json:"followerId"`
	FollowingId string `json:"followingId"`
}

func (h *Handler) FollowUnfollowUser(c *fiber.Ctx) error {
	var body FollowRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	followerUUID, err := uuid.Parse(body.FollowerId)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Invalid UUID: %v",
		})
	}
	followeeUUID, err := uuid.Parse(body.FollowingId)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Invalid UUID: %v",
		})
	}

	print("follower \n")
	print(body.FollowerId)
	print("\n following \n")
	print(body.FollowingId)

	// Get the current user ID (inferred from session, authentication middleware)
	// currentUserId := c.Locals("userId").(string)
	follower, err := h.userRepository.GetUserByID(c.Context(), body.FollowerId)
	print("\n  FID \n")
	print(follower)
	following, err := h.userRepository.GetUserByID(c.Context(), body.FollowingId)
	print("\n FID2 \n")
	print(following)

	if err != nil { //|| !follower || !following

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Check if the current user is already following the target user
	isFollowing, err := h.userRepository.FollowExists(c.Context(), followerUUID, followeeUUID)

	if isFollowing {
		// Unfollow user
		success, err := h.userRepository.UnFollow(c.Context(), followerUUID, followeeUUID)
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
		success, err := h.userRepository.Follow(c.Context(), followerUUID, followeeUUID)
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
