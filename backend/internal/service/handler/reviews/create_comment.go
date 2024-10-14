package reviews

import (
	"platnm/internal/errs"
	"platnm/internal/models"

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

	// Create the comment in the repository
	comment, err := h.reviewRepository.CreateComment(c.Context(), &req.Comment)
	if err != nil {
		return err
	}

	// Return the created comment with HTTP 201 status
	return c.Status(fiber.StatusCreated).JSON(comment)
}
