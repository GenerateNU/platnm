package oauth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

const valueKey = "value"

type SessionValue struct {
	State    string
	Verifier string
}

type SessionValueStore struct {
	*session.Store
}

func NewSessionValueStore(config session.Config) *SessionValueStore {
	store := &SessionValueStore{
		session.New(config),
	}

	store.RegisterType(SessionValue{})
	return store
}

func (s *SessionValueStore) SessionSetValue(c *fiber.Ctx, value SessionValue) error {
	sess, err := s.Get(c)
	if err != nil {
		return err
	}
	sess.Set(valueKey, value)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (s *SessionValueStore) SessionGetValue(c *fiber.Ctx) (SessionValue, error) {
	sess, err := s.Get(c)
	if err != nil {
		return SessionValue{}, err
	}
	return sess.Get(valueKey).(SessionValue), nil
}
