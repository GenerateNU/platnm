package platnm

import (
	"net/http"

	"platnm/internal/auth"
	"platnm/internal/errs"

	"github.com/gofiber/fiber/v2"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) Login(c *fiber.Ctx) error {

	var loginData LoginRequest

	if err := c.BodyParser(&loginData); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	email := loginData.Email
	password := loginData.Password

	authToken, err := auth.GetAuthToken(&h.config, email, password)

	if err != nil {
		return errs.BadRequest("failed to authenticate user")
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"email":    email,
		"password": password,
		"token":    authToken,
	})
}
