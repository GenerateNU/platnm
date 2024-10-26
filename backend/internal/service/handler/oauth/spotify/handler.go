package spotify

import (
	"platnm/internal/config"
	"platnm/internal/service/handler/oauth"
	"platnm/internal/storage"

	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type Handler struct {
	store              *oauth.UserStateStore
	authenticator      *spotifyauth.Authenticator
	userAuthRepository storage.UserAuthRepository
}

func NewHandler(store *oauth.UserStateStore, config config.Spotify, userAuthRepository storage.UserAuthRepository) *Handler {
	authenticator := spotifyauth.New(
		spotifyauth.WithRedirectURL(config.RedirectURI),
		spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate, spotifyauth.ScopePlaylistReadPrivate, spotifyauth.ScopePlaylistReadCollaborative),
		spotifyauth.WithClientID(config.ClientID),
		spotifyauth.WithClientSecret(config.ClientSecret),
	)

	return &Handler{
		store:              store,
		authenticator:      authenticator,
		userAuthRepository: userAuthRepository,
	}
}
