package session

import (
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/zmb3/spotify/v2"
)

type SessionStore struct {
	*session.Store
}

func NewSessionStore(config session.Config) *SessionStore {
	store := &SessionStore{
		session.New(config),
	}

	store.RegisterType(UserState{})
	store.RegisterType(spotify.Client{})

	return store
}
