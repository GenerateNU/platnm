package users

import (
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	userRepository storage.UserRepository
}

func NewHandler(userRepository storage.UserRepository) *Handler {
	return &Handler{
		userRepository,
	}
}

func (h *Handler) GetUsers(c *fiber.Ctx) error {
	users, err := h.userRepository.GetUsers(c.Context())
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(users)
}

func (h *Handler) GetUserById(c *fiber.Ctx) error {
	id := c.Params("id")
	user, err := h.userRepository.GetUserByID(id, c.Context())

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(user)
}
