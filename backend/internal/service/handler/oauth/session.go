package oauth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

const valueKey = "state"

type StateStore struct {
	*session.Store
}

func NewStateStore(config session.Config) *StateStore {
	store := &StateStore{
		session.New(config),
	}

	return store
}

func (s *StateStore) SetState(c *fiber.Ctx, state string) error {
	sess, err := s.Get(c)
	if err != nil {
		return err
	}

	sess.Set(valueKey, state)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (s *StateStore) GetState(c *fiber.Ctx) (string, error) {
	sess, err := s.Get(c)
	if err != nil {
		return "", err
	}
	return sess.Get(valueKey).(string), nil
}
