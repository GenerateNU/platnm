package spotify

import (
	"log/slog"
	"net/http"
	"platnm/internal/constants"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
)

func (h *Handler) Begin(c *fiber.Ctx) error {
	// uuid as state for now
	verifier := oauth2.GenerateVerifier()
	challenge := oauth2.S256ChallengeFromVerifier(verifier)
	state := uuid.NewString()

	sess, err := h.CodeVerifierStateStore.Get(c)
	if err != nil {
		slog.Error("Failed to get session", "error", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	sess.Set("code_verifier_state", codeVerifierState{
		CodeVerifier: verifier,
		State:        state,
	})

	if err := sess.Save(); err != nil {
		slog.Error("Failed to save session", "error", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	url := h.authenticator.AuthURL(state,
		oauth2.SetAuthURLParam("code_challenge_method", "S256"),
		oauth2.SetAuthURLParam("code_challenge", challenge),
	)

	slog.Info("Auth URL:", "url", url)

	c.Set(constants.HeaderRedirect, url)
	return c.SendStatus(http.StatusFound)
}
