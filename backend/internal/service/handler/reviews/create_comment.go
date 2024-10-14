package reviews

import (
	"platnm/internal/errs"
	"platnm/internal/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type createComment struct {
	models.Comment
}

func (h *Handler) CreateComment(c *fiber.Ctx) error {
	// Define a request struct specifically for creating a comment
	var req createComment
	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	if req.ReviewID == 0 {
		return errs.BadRequest("review_id is required")
	} else if req.UserID == "" {
		return errs.BadRequest("user_id is required")
	} else if req.Text == "" {
		return errs.BadRequest("text is required")
	}

	// get the existing review (convert the review_id from int to string)
	existingReview, err := h.reviewRepository.GetExistingReview(c.Context(), strconv.Itoa(req.ReviewID))

	if existingReview == nil {
		return errs.NotFound("Review", "id", req.ReviewID)
	}

	// Create the comment in the repository
	comment, err := h.reviewRepository.CreateComment(c.Context(), &req.Comment)
	if err != nil {
		return err
	}

	// Return the created comment with HTTP 201 status
	return c.Status(fiber.StatusCreated).JSON(comment)
}
