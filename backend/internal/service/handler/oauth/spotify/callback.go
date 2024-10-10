package spotify

import (
	"log/slog"
	"net/http"
	"platnm/internal/constants"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
)

func (h *Handler) Callback(c *fiber.Ctx) error {
	state, err := h.store.GetState(c)
	if err != nil {
		return err
	}

	req, err := adaptor.ConvertRequest(c, false)
	if err != nil {
		return err
	}

	token, err := h.authenticator.Token(c.Context(), state, req)
	if err != nil {
		return err
	}

	slog.Info("Access token:", "token", token.AccessToken)
	slog.Info("Refresh token:", "token", token.RefreshToken)

	c.Set(constants.HeaderRedirect, "http://127.0.0.1:3000")
	return c.SendStatus(http.StatusFound)
}
