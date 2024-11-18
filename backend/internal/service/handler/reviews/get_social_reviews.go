package reviews

import (
	"github.com/gofiber/fiber/v2"
	"platnm/internal/errs"
	"platnm/internal/models"
)

type FriendResponse struct {
	RatingCount    int                   `json:"ratingCount"`
	FriendsReviews []models.FriendReview `json:"friendReviews"`
}

func (h *Handler) GetSocialReviews(c *fiber.Ctx, mediaType string) error {
	var mediaID = ""
	if mediaType == "track" {
		mediaID = c.Params("songid")
	} else if mediaType == "album" {
		mediaID = c.Params("albumid")
	}

	myID := c.Query("userid")
	if myID == "" {
		return errs.BadRequest("userID query parameter is missing.")
	}
	friendsReviews, numberRatings, err := h.reviewRepository.GetSocialReviews(c.Context(), mediaType, mediaID, myID)
	if err != nil {
		return err
	}

	response := FriendResponse{
		RatingCount:    numberRatings,
		FriendsReviews: friendsReviews,
	}

	// Return the JSON response
	return c.Status(fiber.StatusOK).JSON(response)
}
