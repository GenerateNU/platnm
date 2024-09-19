package spotify

import (
	"github.com/gofiber/fiber/v2"
)

const valueKey = "value"

func (h *Handler) sessionSetValue(c *fiber.Ctx, value sessionValue) error {
	sess, err := h.session.Get(c)
	if err != nil {
		return err
	}
	sess.Set(valueKey, value)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (h *Handler) sessionGetValue(c *fiber.Ctx) (sessionValue, error) {
	sess, err := h.session.Get(c)
	if err != nil {
		return sessionValue{}, err
	}
	return sess.Get(valueKey).(sessionValue), nil
}
