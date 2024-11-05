package spotify

import (
	"fmt"
	"platnm/internal/service/handler/oauth"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
)

func (h *Handler) Callback(c *fiber.Ctx) error {
	state := c.Query("state")
	id, err := h.stateStore.GetUser(state)
	if err != nil {
		return err
	}

	fmt.Printf("id: %s\n", id)

	req, err := adaptor.ConvertRequest(c, false)
	if err != nil {
		return err
	}

	token, err := h.authenticator.Token(c.Context(), state, req)
	if err != nil {
		return err
	}

	encryptedToken, err := oauth.EncryptToken(token)
	if err != nil {
		return err
	}

	if err := h.userAuthRepository.SetToken(c.Context(), id, encryptedToken); err != nil {
		return err
	}

	return c.Status(fiber.StatusFound).Redirect("exp://10.0.0.208:8081")
}
