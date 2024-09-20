package handler

import (
	"fmt"
	"platnm/internal/storage"
	"strconv"

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
	offsetstr := c.Query("offset", "0")
	limitstr := c.Query("limit", "10")
	//limitParam := r.URL.Query().Get("limit")
	//offsetParam := r.URL.Query().Get("offset")
	//review, err := h.reviewRepository.GetReviewsByID(id, mediaType, c.Context())

	var offset int
	if offsetstr == "" {
		offset = 0 // Default to 0 if no offset is provided
	} else {
		var err error
		offset, err = strconv.Atoi(offsetstr)
		if err != nil || offset < 0 {
			offset = 0 // Ensure offset is non-negative
		}
	}

	// Check if limitstr is empty, then default to 10
	var limit int
	if limitstr == "" {
		limit = 10 // Default to 10 if no limit is provided
	} else {
		var err error
		limit, err = strconv.Atoi(limitstr)
		if err != nil || limit <= 0 {
			limit = 10 // Ensure limit is positive
		}
	}

	print("running?")

	// Fetch the review based on ID and media type
	review, err := h.reviewRepository.GetReviewsByID(c.Context(), id, mediaType)
	if err != nil {
		// If error, log it and return 500
		fmt.Println(err.Error(), "from transactions err ")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to retrieve reviews",
		})
	}

	// If no review is found, return a 404 status
	if len(review) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No reviews found",
		})
	}

	// Calculate average rating
	var avgRating float64
	for _, r := range review {
		rating, err := strconv.ParseFloat(r.Rating, 64)
		if err != nil {
			avgRating += rating
		}

	}
	if len(review) > 0 {
		avgRating /= float64(len(review))
	}

	var end = offset*limit - 1
	var start = end - limit
	var paginatedReview = review[start:end]

	// Return the reviews and average rating
	response := fiber.Map{
		"avgRating": avgRating,
		"reviews":   paginatedReview,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
