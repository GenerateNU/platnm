package session

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

const valueKey = "userState"

type UserState struct {
	User  uuid.UUID
	State string
}

func (s *SessionStore) SetState(c *fiber.Ctx, userState UserState) error {
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

func (s *SessionStore) GetState(c *fiber.Ctx) (UserState, error) {
	sess, err := s.Get(c)
	if err != nil {
		return UserState{}, err
	}
	return sess.Get(valueKey).(UserState), nil
}
