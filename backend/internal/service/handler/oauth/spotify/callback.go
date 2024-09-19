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
	v, err := h.store.SessionGetValue(c)
	if err != nil {
		return err
	}

	req, err := adaptor.ConvertRequest(c, false)
	if err != nil {
		return err
	}

	token, err := h.authenticator.Token(c.Context(), v.State, req, oauth2.SetAuthURLParam("code_verifier", v.Verifier))
	if err != nil {
		return err
	}

	slog.Info("Access token:", "token", token.AccessToken)
	slog.Info("Refresh token:", "token", token.RefreshToken)

	c.Set(constants.HeaderRedirect, "http://127.0.0.1:3000")
	return c.SendStatus(http.StatusFound)
}
