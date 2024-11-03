package users

import (
	"platnm/internal/errs"
	"platnm/internal/storage"

	"github.com/google/uuid"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	userRepository     storage.UserRepository
	playlistRepository storage.PlaylistRepository
}

func NewHandler(userRepository storage.UserRepository, playlistRepository storage.PlaylistRepository) *Handler {
	return &Handler{
		userRepository,
		playlistRepository,
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

func (h *Handler) GetUserFeed(c *fiber.Ctx) error {
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

	feed, err := h.userRepository.GetUserFeed(c.Context(), userUUID)
	if err != nil {
		print(err.Error(), "unable to fetch profile ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(feed)

}
