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
	sess, err := h.CodeVerifierStateStore.Get(c)
	if err != nil {
		slog.Error("Failed to get session", "error", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	cvs, ok := sess.Get("code_verifier_state").(codeVerifierState)
	if !ok {
		slog.Error("Failed to get code verifier state")
		return c.SendStatus(http.StatusInternalServerError)
	}

	req, err := adaptor.ConvertRequest(c, false)
	if err != nil {
		return err
	}
	token, err := h.authenticator.Token(c.Context(), cvs.State, req, oauth2.SetAuthURLParam("code_verifier", cvs.CodeVerifier))
	if err != nil {
		slog.Error("Failed to get token", "error", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	slog.Info("Access token:", "token", token.AccessToken)
	slog.Info("Refresh token:", "token", token.RefreshToken)

	c.Set(constants.HeaderRedirect, "http://127.0.0.1:3000")
	return c.SendStatus(http.StatusFound)
}
