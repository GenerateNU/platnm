package users

import (
	"platnm/internal/errs"
	"platnm/internal/service/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (h *Handler) GetConnections(c *fiber.Ctx) error {
	type request struct {
		utils.Pagination
	}

	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return errs.BadRequest("invalid user id")
	}

	var req request
	if err := c.QueryParser(&req); err != nil {
		return errs.InvalidJSON()
	}

	connections, err := h.userRepository.GetConnections(c.Context(), id, req.Limit, req.GetOffset())
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(connections)
}
