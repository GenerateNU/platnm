package users

import (
	"platnm/internal/config"
	"platnm/internal/errs"
	"platnm/internal/models"
	"platnm/internal/service/session"
	"platnm/internal/storage"

	"github.com/google/uuid"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	userRepository     storage.UserRepository
	playlistRepository storage.PlaylistRepository
	config             config.Supabase
	store              *session.SessionStore
}

type UpdateUserOnboardRequest struct {
	Email      string `json:"email" validate:"required,email"`
	Enthusiasm string `json:"music_enthusiasm" validate:"required"`
}

func NewHandler(userRepository storage.UserRepository, playlistRepository storage.PlaylistRepository, config config.Supabase, store *session.SessionStore) *Handler {
	return &Handler{
		userRepository,
		playlistRepository,
		config,
		store,
	}
}

func (h *Handler) GetUsers(c *fiber.Ctx) error {
	users, err := h.userRepository.GetUsers(c.Context())
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(users)
}

func (h *Handler) UpdateUserOnboard(c *fiber.Ctx) error {
	var request UpdateUserOnboardRequest

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	result, err := h.userRepository.UpdateUserOnboard(c.Context(), request.Email, request.Enthusiasm)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

func (h *Handler) GetProfileByName(c *fiber.Ctx) error {
	name := c.Params("name")
	profile, err := h.userRepository.GetProfileByName(c.Context(), name)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(profile)
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

func (h *Handler) GetNotifications(c *fiber.Ctx) error {
	id := c.Params("id")

	notifications, err := h.userRepository.GetNotifications(c.Context(), id)
	if err != nil {
		return err
	}
	if notifications == nil {
		return c.Status(fiber.StatusOK).JSON([]*models.Notification{})
	}
	return c.Status(fiber.StatusOK).JSON(notifications)

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

func (h *Handler) UpdateUserProfilePicture(c *fiber.Ctx) error {
	id := c.Params("id")

	userUUID, err := uuid.Parse(id)
	if err != nil {
		return err
	}

	var requestBody struct {
		ProfilePicture string `json:"profile_picture"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		return err
	}

	if err := h.userRepository.UpdateUserProfilePicture(c.Context(), userUUID, requestBody.ProfilePicture); err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Profile picture updated successfully",
	})
}

func (h *Handler) UpdateUserBio(c *fiber.Ctx) error {
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
		print(err.Error())
		return err
	}

	var requestBody struct {
		Bio string `json:"bio"`
	}

	if err := c.BodyParser(&requestBody); err != nil {
		print(err.Error())
		return err
	}

	if err := h.userRepository.UpdateUserBio(c.Context(), userUUID, requestBody.Bio); err != nil {
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
