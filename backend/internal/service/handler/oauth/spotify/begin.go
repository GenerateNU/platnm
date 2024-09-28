package spotify

import (
	"net/http"
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

	if err := h.store.SetState(c, state); err != nil {
		return err
	}

	c.Set(constants.HeaderRedirect, url)
	return c.SendStatus(http.StatusFound)
}
