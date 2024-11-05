package session

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
)

const (
	authTokenKey        = "authToken"
	clientCredsTokenKey = "clientCredsToken"
)

func (u *SessionStore) SetAuthToken(c *fiber.Ctx, token *oauth2.Token) error {
	sess, err := u.Get(c)
	if err != nil {
		return err
	}

	sess.Set(authTokenKey, token)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (u *SessionStore) GetAuthToken(c *fiber.Ctx) (*oauth2.Token, error) {
	sess, err := u.Get(c)
	if err != nil {
		return nil, err
	}

	v := sess.Get(authTokenKey)
	if v == nil {
		return nil, nil
	}

	return v.(*oauth2.Token), nil
}

func (u *SessionStore) SetClientCredsToken(c *fiber.Ctx, token *oauth2.Token) error {
	sess, err := u.Get(c)
	if err != nil {
		return err
	}

	sess.Set(clientCredsTokenKey, token)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (u *SessionStore) GetClientCredsToken(c *fiber.Ctx) (*oauth2.Token, error) {
	sess, err := u.Get(c)
	if err != nil {
		return nil, err
	}

	v := sess.Get(clientCredsTokenKey)
	if v == nil {
		return nil, nil
	}

	return v.(*oauth2.Token), nil
}
