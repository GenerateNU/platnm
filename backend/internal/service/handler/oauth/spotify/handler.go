package spotify

import (
	"platnm/internal/config"
	"platnm/internal/service/handler/oauth"

	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type Handler struct {
	store         *oauth.StateStore
	authenticator *spotifyauth.Authenticator
}

func NewHandler(store *oauth.StateStore, config config.Spotify) *Handler {
	authenticator := spotifyauth.New(
		spotifyauth.WithRedirectURL(config.RedirectURI),
		spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate),
		spotifyauth.WithClientID(config.ClientID),
		spotifyauth.WithClientSecret(config.ClientSecret),
	)

	return &Handler{
		store:         store,
		authenticator: authenticator,
	}
}
