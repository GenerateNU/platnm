package users

import (
	"platnm/internal/auth"
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

type createUserRequest struct {
	DisplayName string `json:"display_name"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	Username    string `json:"username"`
}

type createUserResponse struct {
	AccessToken string `json:"access_token"`
	models.User
}

func (c *createUserRequest) validate() map[string]string {
	errs := make(map[string]string)

	if c.DisplayName == "" {
		errs["display_name"] = "display name is required"
	}

	if c.Email == "" {
		errs["email"] = "email is required"
	}

	if c.Password == "" {
		errs["password"] = "password is required"
	}

	if c.Username == "" {
		errs["username"] = "username is required"
	}

	return errs
}

func (h *Handler) CreateUser(c *fiber.Ctx) error {
	var req createUserRequest
	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("invalid request body")
	}

	errMap := req.validate()
	if len(errMap) > 0 {
		return errs.InvalidRequestData(errMap)
	}

	resp, err := auth.SupabaseSignup(&h.config, req.Email, req.Password)
	if err != nil {
		return err
	}

	user, err := h.userRepository.CreateUser(c.Context(), models.User{
		ID:          resp.User.ID.String(),
		DisplayName: req.DisplayName,
		Email:       req.Email,
		Username:    req.Username,
	})
	if err != nil {
		return err
	}

	// TODO: Change depending on what the default bio and cover photo
	playlist_err := h.playlistRepository.CreatePlaylist(c.Context(), models.Playlist{
		Title:      "On Queue",
		UserID:     user.ID,
		Bio:        "What's in your queue right now?",
		CoverPhoto: "",
	})
	if playlist_err != nil {
		return err
	}

	if err := h.store.SetUser(c, resp.User.ID); err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(createUserResponse{
		AccessToken: resp.AccessToken,
		User:        user,
	})
}
