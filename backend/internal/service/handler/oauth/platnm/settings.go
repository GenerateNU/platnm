package platnm

import (
    "platnm/internal/errs"
    "platnm/internal/auth"
    "github.com/gofiber/fiber/v2"
)

func (h *Handler) ResetPassword(c *fiber.Ctx) error {
	var req struct {
		Email          string `json:"email"`
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return errs.BadRequest("failed to parse request body")
	}

	// Authenticate the user to get an access token
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
    	// Get the access token from the request header or body
	accessToken := c.Get("Authorization") // Assuming it's passed as a Bearer token in the Authorization header
	if accessToken == "" {
		return errs.BadRequest("no authorization token provided")
	}

	// Sign out the user
	err := auth.SignOut(&h.config, accessToken)
	if err != nil {
		return err
	}
    
    return c.SendStatus(fiber.StatusOK)
}
    

func (h *Handler) DeactivateAccount(c *fiber.Ctx) error {
    // Get the user ID from the request
    userID := c.Locals("userID").(string)

    // Delete the user account
    err := auth.DeleteUser(&h.config, userID)
    if err != nil {
        return errs.BadRequest("failed to delete user account")
    }

    return c.SendStatus(fiber.StatusOK)
}
