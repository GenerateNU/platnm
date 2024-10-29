package session

import "github.com/gofiber/fiber/v2"

const emailKey = "email"

func (s *SessionStore) SetUser(c *fiber.Ctx, email string) error {
	sess, err := s.Get(c)
	if err != nil {
		return err
	}

	sess.Set(emailKey, email)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (s *SessionStore) GetUser(c *fiber.Ctx) (string, error) {
	sess, err := s.Get(c)
	if err != nil {
		return "", err
	}

	v := sess.Get(emailKey)
	if v == nil {
		return "", nil
	}

	return v.(string), nil
}
