package spotify

import (
	"platnm/internal/config"
	"platnm/internal/service/handler/oauth"

	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type Handler struct {
	store         *oauth.SessionValueStore
	authenticator *spotifyauth.Authenticator
}

func NewHandler(store *oauth.SessionValueStore, config config.Spotify) *Handler {
	authenticator := spotifyauth.New(
		spotifyauth.WithRedirectURL(config.RedirectURI),
		spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate),
	)

	return &Handler{
		store:         store,
		authenticator: authenticator,
	}
}
