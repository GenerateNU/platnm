package spotify

import (
	"platnm/internal/config"
	"platnm/internal/service/handler/oauth"
	"platnm/internal/service/session"
	"platnm/internal/storage"

	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type Handler struct {
	sessionStore       *session.SessionStore
	stateStore         *oauth.StateStore
	authenticator      *spotifyauth.Authenticator
	userAuthRepository storage.UserAuthRepository
}

func NewHandler(sessionStore *session.SessionStore, stateStore *oauth.StateStore, config config.Spotify, userAuthRepository storage.UserAuthRepository) *Handler {
	authenticator := spotifyauth.New(
		spotifyauth.WithRedirectURL(config.RedirectURI),
		spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate, spotifyauth.ScopePlaylistReadPrivate, spotifyauth.ScopePlaylistReadCollaborative),
		spotifyauth.WithClientID(config.ClientID),
		spotifyauth.WithClientSecret(config.ClientSecret),
	)

	return &Handler{
		sessionStore:       sessionStore,
		stateStore:         stateStore,
		authenticator:      authenticator,
		userAuthRepository: userAuthRepository,
	}
}
