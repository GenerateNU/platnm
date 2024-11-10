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

	id, err := h.sessionStore.GetUser(c)
	if err != nil {
		return err
	}

	if err := h.stateStore.SetUser(state, id); err != nil {
		return err
	}

	c.Set(constants.HeaderRedirect, url)
	return c.SendStatus(fiber.StatusFound)
}
