package session

import (
	"github.com/gofiber/fiber/v2"
)

const stateKey = "userState"

func (s *SessionStore) SetState(c *fiber.Ctx, state string) error {
	sess, err := s.Get(c)
	if err != nil {
		return err
	}

	sess.Set(stateKey, state)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (s *SessionStore) GetState(c *fiber.Ctx) (string, error) {
	sess, err := s.Get(c)
	if err != nil {
		return "", err
	}
	v := sess.Get(stateKey)
	if v == nil {
		return "", nil
	}

	return v.(string), nil
}
