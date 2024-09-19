package spotify

import (
	"log/slog"
	"net/http"
	"platnm/internal/constants"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"golang.org/x/oauth2"
)

func (h *Handler) Callback(c *fiber.Ctx) error {
	state := c.Query("state")

	sv, err := h.store.Get(state)
	if err != nil {
		return err
	}

	var stateValue stateValue
	if err := stateValue.UnmarshalBinary(sv); err != nil {
		return err
	}

	req, err := adaptor.ConvertRequest(c, false)
	if err != nil {
		return err
	}

	token, err := h.authenticator.Token(c.Context(), state, req, oauth2.SetAuthURLParam("code_verifier", stateValue.Verifier))
	if err != nil {
		slog.Error("Failed to get token", "error", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	slog.Info("Access token:", "token", token.AccessToken)
	slog.Info("Refresh token:", "token", token.RefreshToken)

	c.Set(constants.HeaderRedirect, "http://127.0.0.1:3000")
	return c.SendStatus(http.StatusFound)
}