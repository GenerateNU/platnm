package session

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

const idKey = "id"

func (s *SessionStore) SetUser(c *fiber.Ctx, id uuid.UUID) error {
	sess, err := s.Get(c)
	if err != nil {
		return err
	}

	sess.Set(idKey, id)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (s *SessionStore) GetUser(c *fiber.Ctx) (uuid.UUID, error) {
	sess, err := s.Get(c)
	if err != nil {
		return uuid.UUID{}, err
	}

	v := sess.Get(idKey)
	if v == nil {
		return uuid.UUID{}, nil
	}

	return v.(uuid.UUID), nil
}
