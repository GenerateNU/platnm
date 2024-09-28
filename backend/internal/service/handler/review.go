package handler

import (
	"fmt"
	"platnm/internal/models"
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
)

type ReviewHandler struct {
	reviewRepository storage.ReviewRepository
}

func NewReviewHandler(reviewRepository storage.ReviewRepository) *ReviewHandler {
	return &ReviewHandler{
		reviewRepository,
	}
}

func (h *ReviewHandler) GetReviewById(c *fiber.Ctx, mediaType string) error {
	var (
		id     = c.Params("id")
		offset = c.QueryInt("page", 0)
		limit  = c.QueryInt("limit", 10)
	)

	if offset < 0 {
		offset = 0 // Ensure offset is non-negative
	}

	if limit <= 0 {
		limit = 10 // Ensure limit is positive
	}

	// Fetch the review based on ID and media type
	reviews, err := h.reviewRepository.GetReviewsByID(c.Context(), id, mediaType)
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
		if err == nil { // Only append if conversion succeeds
			scores = append(scores, rating)
		}
	}

	var rating = getAve(scores)
	var paginatedReview = paginate(reviews, limit, offset)

	response := Response{
		AvgRating: rating,
		Reviews:   paginatedReview,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func paginate(reviews []*models.Review, limit int, offset int) []*models.Review {

	// Adjust if end exceeds the length of the array
	if limit > len(reviews) {
		limit = len(reviews)
	}

	// Return the sliced array for the given page
	return reviews[offset:limit]
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
	AvgRating float64          `json:"avgRating"`
	Reviews   []*models.Review `json:"reviews"`
}
