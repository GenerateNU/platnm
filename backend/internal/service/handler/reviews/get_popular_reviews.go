package reviews

import (
	"platnm/internal/errs"
	"platnm/internal/service/utils"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetReviewsByPopularity(c *fiber.Ctx) error {
	type request struct {
		utils.Pagination
	}

	var req request
	if err := c.QueryParser(&req); err != nil {
		return errs.BadRequest("invalid query parameters")
	}

	if errMap := req.Validate(); len(errMap) > 0 {
		return errs.InvalidRequestData(errMap)
	}

	reviews, err := h.reviewRepository.GetReviewsByPopularity(c.Context(), req.Limit, req.GetOffset())

	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(reviews)

}
