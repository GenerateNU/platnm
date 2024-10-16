package users

import (
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

	user, err := h.userRepository.CreateUser(c.Context(), models.User{
		DisplayName: req.DisplayName,
		Email:       req.Email,
		Username:    req.Username,
	})
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(user)

}
