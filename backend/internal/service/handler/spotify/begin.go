package spotify

import (
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

	url := h.authenticator.AuthURL(state,
		oauth2.SetAuthURLParam("code_challenge_method", "S256"),
		oauth2.SetAuthURLParam("code_challenge", challenge),
	)

	sv := stateValue{
		Verifier:  verifier,
		Challenge: challenge,
	}

	stateValue, err := sv.MarshalBinary()
	if err != nil {
		return err
	}

	h.store.Set(state, stateValue, constants.StateExpiresAfter)

	c.Set(constants.HeaderRedirect, url)
	return c.SendStatus(http.StatusFound)
}
