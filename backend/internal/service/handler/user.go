package handler

import (
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	userRepository storage.UserRepository
}

func NewUserHandler(userRepository storage.UserRepository) *UserHandler {
	return &UserHandler{
		userRepository,
	}
}

func (h *UserHandler) GetUsers(c *fiber.Ctx) error {
	users, err := h.userRepository.GetUsers(c.Context())
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(users)
}

func (h *UserHandler) GetUserById(c *fiber.Ctx) error {
	id := c.Params("id")
	user, err := h.userRepository.GetUserByID(id, c.Context())

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

