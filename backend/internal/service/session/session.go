package session

import (
	"github.com/gofiber/fiber/v2/middleware/session"
	"golang.org/x/oauth2"
)

type SessionStore struct {
	*session.Store
}

func NewSessionStore(config session.Config) *SessionStore {
	store := &SessionStore{
		session.New(config),
	}

	store.RegisterType(UserState{})
	store.RegisterType(oauth2.Token{})

	return store
}
