package spotify

import (
	"platnm/internal/service/handler/oauth"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (h *Handler) Begin(c *fiber.Ctx) error {
	uid, err := uuid.Parse(c.Query("userID"))
	if err != nil {
		return err
	}

	state, err := oauth.GenerateState()
	if err != nil {
		return err
	}

	url := h.authenticator.AuthURL(state)

	if err := h.store.SetState(c, oauth.UserState{User: uid, State: state}); err != nil {
		return err
	}

	// c.Set(constants.HeaderRedirect, url)
	// return c.SendStatus(http.StatusFound)
	return c.Redirect(url)
}
