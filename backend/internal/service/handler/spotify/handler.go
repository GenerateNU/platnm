package spotify

import (
	"platnm/internal/config"

	"time"

	"github.com/gofiber/fiber/v2/middleware/session"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

type Handler struct {
	CodeVerifierStateStore *session.Store
	authenticator          *spotifyauth.Authenticator
}

type codeVerifierState struct {
	CodeVerifier string
	State        string
}

func NewHandler(config config.Spotify) *Handler {
	store := session.New(
		session.Config{
			Expiration: 10 * time.Minute,
		},
	)

	store.RegisterType(codeVerifierState{})

	authenticator := spotifyauth.New(spotifyauth.WithRedirectURL(config.RedirectURI), spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate))

	return &Handler{
		CodeVerifierStateStore: store,
		authenticator:          authenticator,
	}
}
