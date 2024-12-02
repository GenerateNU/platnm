package platnm

import (
	"github.com/gofiber/fiber/v2"
	"platnm/internal/auth"
	"platnm/internal/errs"
	"fmt"
)

func (h *Handler) ForgotPassword(c *fiber.Ctx) error {
	var req struct {
		Email string `json:"email"`
	}
	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}
	err := auth.RecoverPassword(&h.config, req.Email)
	if err != nil {
		fmt.Println("Error: ", err)
		return errs.BadRequest("failed to send reset password email")
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) ResetPassword(c *fiber.Ctx) error {
	var req struct {
		Email           string `json:"email"`
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	authToken, err := auth.GetAuthToken(&h.config, req.Email, req.CurrentPassword)
	if err != nil {
		return errs.BadRequest("authentication failed")
	}

	// Update the user's password
	err = auth.ResetPassword(&h.config, authToken.AccessToken, req.NewPassword)
	if err != nil {
		return errs.BadRequest("failed to update password")
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) SignOut(c *fiber.Ctx) error {
	bearerToken := c.Get("Authorization")
	err := auth.SignOut(&h.config, bearerToken)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) DeactivateAccount(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	err := auth.DeleteUser(&h.config, userID)
	if err != nil {
		return errs.BadRequest("failed to delete user account")
	}

	return c.SendStatus(fiber.StatusOK)
}
