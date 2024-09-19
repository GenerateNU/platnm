package spotify

import (
	"platnm/internal/config"

	"github.com/gofiber/storage"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type Handler struct {
	store         storage.Storage
	authenticator *spotifyauth.Authenticator
}

func NewHandler(store storage.Storage, config config.Spotify) *Handler {
	authenticator := spotifyauth.New(
		spotifyauth.WithRedirectURL(config.RedirectURI),
		spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate),
	)
	return &Handler{
		store:         store,
		authenticator: authenticator,
	}
}
