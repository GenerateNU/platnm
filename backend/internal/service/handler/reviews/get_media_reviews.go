package reviews

import (
	"fmt"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetReviewsByMediaId(c *fiber.Ctx, mediaType string) error {
	var id = c.Params("id")

	page := c.QueryInt("page", 0)
	limit := c.QueryInt("limit", 20)

	// Even though we are paginating the reviews we need to get all the reviews in order to calculate average rating
	// Fetch the review based on ID and media type
	reviews, err := h.reviewRepository.GetReviewsByMediaID(c.Context(), id, mediaType)
	if err != nil {
		// If error, log it and return 500
		fmt.Println(err.Error(), "from transactions err ")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to retrieve reviews",
		})
	}

	var scores []float64

	for _, r := range reviews {
		rating := float64(r.Rating)
		scores = append(scores, rating)
	}

	var rating = getAve(scores)
	var paginatedReview = paginate(reviews, limit, page)

	response := Response{
		AvgRating:  rating,
		TotalCount: len(reviews),
		Reviews:    paginatedReview,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func paginate(reviews []*models.Preview, limit int, offset int) []*models.Preview {
	var start = offset * limit
	var end = (offset * limit) + limit

	// Adjust if end exceeds the length of the array
	if end > len(reviews) {
		end = len(reviews)
	}

	// Return the sliced array for the given page
	return reviews[start:end]
}

func getAve(review []float64) float64 {
	var avgRating float64
	for _, r := range review {
		avgRating += r
	}

	if len(review) > 0 {
		avgRating /= float64(len(review))
	}
	return avgRating
}

type Response struct {
	AvgRating  float64           `json:"avgRating"`
	TotalCount int               `json:"totalCount"`
	Reviews    []*models.Preview `json:"reviews"`
}
