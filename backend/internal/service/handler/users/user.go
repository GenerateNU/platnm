package users

import (
	"github.com/google/uuid"
	"platnm/internal/errs"
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
	user, err := h.userRepository.GetUserByID(c.Context(), id)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

func (h *Handler) CalculateScore(c *fiber.Ctx) error {
	id := c.Params("id")

	exists, err := h.userRepository.UserExists(c.Context(), id)
	if err != nil {
		return err
	}

	if !exists {
		return errs.NotFound("User", "userID", id)
	}

	userUUID, err := uuid.Parse(id)
	if err != nil {
		return err
	}

	score, err := h.userRepository.CalculateScore(c.Context(), userUUID)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(score)
}

func (h *Handler) GetUserProfile(c *fiber.Ctx) error {
	id := c.Params("id")

	exists, err := h.userRepository.UserExists(c.Context(), id)
	if err != nil {
		print(err.Error())
		return err
	}

	if !exists {
		return errs.NotFound("User", "userID", id)
	}

	userUUID, err := uuid.Parse(id)
	if err != nil {
		print(err.Error())
		return err
	}

	profile, err := h.userRepository.GetUserProfile(c.Context(), userUUID)
	if err != nil {
		print(err.Error(), "unable to fetch profile ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(profile)

}