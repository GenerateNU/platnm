package spotify

import (
	"platnm/internal/constants"
	"platnm/internal/service/handler/oauth"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) Begin(c *fiber.Ctx) error {
	state, err := oauth.GenerateState()
	if err != nil {
		return err
	}

	url := h.authenticator.AuthURL(state)

	// should only need to store state value in store
	// since user id should already be attached to session
	// since user needs to be authenticated to link account with spotify
	// but until id is stored in session, just store like this
	if err := h.store.SetState(c, state); err != nil {
		return err
	}

	c.Set(constants.HeaderRedirect, url)
	return c.SendStatus(fiber.StatusFound)
}
