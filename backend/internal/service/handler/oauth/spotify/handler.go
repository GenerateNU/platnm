package spotify

import (
	"platnm/internal/config"
	"platnm/internal/service/session"
	"platnm/internal/storage"

	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type Handler struct {
	store              *session.SessionStore
	authenticator      *spotifyauth.Authenticator
	userAuthRepository storage.UserAuthRepository
}

func NewHandler(store *session.SessionStore, config config.Spotify, userAuthRepository storage.UserAuthRepository) *Handler {
	authenticator := spotifyauth.New(
		spotifyauth.WithRedirectURL(config.RedirectURI),
		spotifyauth.WithScopes(
			spotifyauth.ScopeUserReadPrivate,
			spotifyauth.ScopePlaylistReadPrivate,
			spotifyauth.ScopePlaylistReadCollaborative,
			spotifyauth.ScopeUserTopRead,
		),
		spotifyauth.WithClientID(config.ClientID),
		spotifyauth.WithClientSecret(config.ClientSecret),
	)

	return &Handler{
		store:              store,
		authenticator:      authenticator,
		userAuthRepository: userAuthRepository,
	}
}
