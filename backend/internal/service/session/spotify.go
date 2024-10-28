package session

import (
	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

const (
	authSpotifyClientKey        = "authSpotifyClient"
	clientCredsSpotifyClientKey = "clientCredsSpotifyClient"
)

func (u *SessionStore) SetAuthSpotifyClient(c *fiber.Ctx, client *spotify.Client) error {
	sess, err := u.Get(c)
	if err != nil {
		return err
	}

	sess.Set(authSpotifyClientKey, client)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (u *SessionStore) GetAuthSpotifyClient(c *fiber.Ctx) (*spotify.Client, error) {
	sess, err := u.Get(c)
	if err != nil {
		return nil, err
	}

	v := sess.Get(authSpotifyClientKey)
	if v == nil {
		return nil, nil
	}

	return v.(*spotify.Client), nil
}

func (u *SessionStore) SetClientCredsSpotifyClient(c *fiber.Ctx, client *spotify.Client) error {
	sess, err := u.Get(c)
	if err != nil {
		return err
	}

	sess.Set(clientCredsSpotifyClientKey, client)
	if err := sess.Save(); err != nil {
		return err
	}
	return nil
}

func (u *SessionStore) GetClientCredsSpotifyClient(c *fiber.Ctx) (*spotify.Client, error) {
	sess, err := u.Get(c)
	if err != nil {
		return nil, err
	}

	v := sess.Get(clientCredsSpotifyClientKey)
	if v == nil {
		return nil, nil
	}

	return v.(*spotify.Client), nil
}
