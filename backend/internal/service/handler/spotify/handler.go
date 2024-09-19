package spotify

import (
	"platnm/internal/config"
	"platnm/internal/constants"

	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type Handler struct {
	store         *session.Store
	authenticator *spotifyauth.Authenticator
}

func NewHandler(store storage.Storage, config config.Spotify) *Handler {
	authenticator := spotifyauth.New(
		spotifyauth.WithRedirectURL(config.RedirectURI),
		spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate),
	)
	session := session.New(session.Config{
		Storage:    store,
		Expiration: constants.SessionDuration,
		KeyLookup:  "header:" + constants.HeaderSession,
	})

	session.RegisterType(sessionValue{})
	return &Handler{
		store:         session,
		authenticator: authenticator,
	}
}
