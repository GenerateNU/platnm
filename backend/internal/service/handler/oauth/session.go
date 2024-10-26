package oauth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/google/uuid"
)

const valueKey = "userState"

type UserStateStore struct {
	*session.Store
}

type UserState struct {
	User  uuid.UUID
	State string
}

func NewStateStore(config session.Config) *UserStateStore {
	store := &UserStateStore{
		session.New(config),
	}

	return store
}

func (s *UserStateStore) SetState(c *fiber.Ctx, userState UserState) error {
	sess, err := s.Get(c)
	if err != nil {
		return err
	}

	sess.Set(valueKey, userState)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (s *UserStateStore) GetState(c *fiber.Ctx) (UserState, error) {
	sess, err := s.Get(c)
	if err != nil {
		return UserState{}, err
	}
	return sess.Get(valueKey).(UserState), nil
}
