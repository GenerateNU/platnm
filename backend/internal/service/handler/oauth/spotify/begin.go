package spotify

import (
	"net/http"
	"platnm/internal/constants"
	"platnm/internal/service/handler/oauth"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
)

func (h *Handler) Begin(c *fiber.Ctx) error {
	var (
		verifier  = oauth2.GenerateVerifier()
		challenge = oauth2.S256ChallengeFromVerifier(verifier)
	)

	state, err := oauth.GenerateState()
	if err != nil {
		return err
	}

	url := h.authenticator.AuthURL(state,
		oauth2.SetAuthURLParam("code_challenge_method", "S256"),
		oauth2.SetAuthURLParam("code_challenge", challenge),
	)

	if err := h.store.SessionSetValue(c, oauth.SessionValue{State: state, Verifier: verifier}); err != nil {
		return err
	}

	c.Set(constants.HeaderRedirect, url)
	return c.SendStatus(http.StatusFound)
}