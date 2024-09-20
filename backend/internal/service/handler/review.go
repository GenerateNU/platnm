package handler
import "strconv"

import (
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

func (h *ReviewHandler) GetReviews(c *fiber.Ctx) error {
	review, err := h.reviewRepository.GetReviews(c.Context())
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(review)
}

func (h *ReviewHandler) GetReviewById(c *fiber.Ctx, mediaType string) error {
	id := c.Params("id")
	offset := c.Query("offset", 0)
	limit := c.Query("limit", 10)
	//limitParam := r.URL.Query().Get("limit")
	//offsetParam := r.URL.Query().Get("offset")
	review, err := h.reviewRepository.GetReviewsByID(id, mediaType, c.Context())

	/*
	// Parse offset and limit as integers
	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0 // Ensure offset is non-negative
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10 // Ensure limit is positive
	}

	// Fetch the review based on ID and media type
	review, err := h.reviewRepository.GetReviewByID(id, mediaType, c.Context(), offset, limit)
	if err != nil {
		// If error, log it and return 500
		fmt.Println(err.Error(), "from transactions err ")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to retrieve reviews",
		})
	}

	// If no review is found, return a 404 status
	if review == nil || len(review) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No reviews found",
		})
	}

	// Calculate average rating
	var avgRating float64
	for _, r := range review {
		avgRating += r.Rating
	}
	if len(review) > 0 {
		avgRating /= float64(len(review))
	}

	// Return the reviews and average rating
	response := fiber.Map{
		"avgRating": avgRating,
		"reviews":   review,
	}

	return c.Status(fiber.StatusOK).JSON(response)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}
*/
	return c.Status(fiber.StatusOK).JSON(review)
}
