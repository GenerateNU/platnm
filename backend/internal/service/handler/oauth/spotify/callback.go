package spotify

import (
	"fmt"
	"net/http"
	"platnm/internal/constants"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
)

func (h *Handler) Callback(c *fiber.Ctx) error {
	userState, err := h.store.GetState(c)
	if err != nil {
		return err
	}
	fmt.Printf("User state: %+v\n", userState)

	req, err := adaptor.ConvertRequest(c, false)
	if err != nil {
		return err
	}

	token, err := h.authenticator.Token(c.Context(), userState.State, req)
	if err != nil {
		return err
	}

	if err := h.userAuthRepository.SetToken(c.Context(), userState.User, token); err != nil {
		return err
	}

	c.Set(constants.HeaderRedirect, "http://127.0.0.1:3000")
	return c.SendStatus(http.StatusFound)
}
