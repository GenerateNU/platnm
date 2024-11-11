package reviews

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetReviewByID(c *fiber.Ctx) error {
	id := c.Params("id")

	review, err := h.reviewRepository.GetReviewByID(c.Context(), id)

	if err != nil {
		fmt.Println(err.Error(), "from transactions err ")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "No review with ID",
		})
	}

	return c.Status(fiber.StatusOK).JSON(review)
}
