package spotify

import (
	"fmt"
	"platnm/internal/config"
	"platnm/internal/service/ctxt"
	"platnm/internal/service/handler/oauth"
	"platnm/internal/service/session"
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"

	"github.com/zmb3/spotify/v2"
	"golang.org/x/oauth2/clientcredentials"
)

type Middleware struct {
	clientID           string
	clientSecret       string
	redirectURI        string
	userAuthRepository storage.UserAuthRepository
	sessionStore       session.SessionStore
}

func NewMiddleware(config config.Spotify, userAuthRepository storage.UserAuthRepository, sessionStore *session.SessionStore) *Middleware {
	return &Middleware{
		clientID:           config.ClientID,
		clientSecret:       config.ClientSecret,
		redirectURI:        config.RedirectURI,
		userAuthRepository: userAuthRepository,
		sessionStore:       *sessionStore,
	}
}

func (m *Middleware) WithAuthenticatedSpotifyClient() fiber.Handler {
	return func(c *fiber.Ctx) error {
		token, err := m.sessionStore.GetAuthToken(c)
		if err != nil {
			return err
		}

		if token == nil {
			user, err := m.sessionStore.GetUser(c)
			fmt.Printf("user: %v\n", user)
			if err != nil {
				return err
			}

			encryptedToken, err := m.userAuthRepository.GetToken(c.Context(), user)
			if err != nil {
				return err
			}

			t, err := oauth.DecryptToken(encryptedToken)
			token = &t
			if err != nil {
				return err
			}

			if err := m.sessionStore.SetAuthToken(c, token); err != nil {
				return err
			}
		}

		// client id and secret are required to refresh the token
		authenticator := spotifyauth.New(
			spotifyauth.WithClientID(m.clientID),
			spotifyauth.WithClientSecret(m.clientSecret),
		)
		httpClient := authenticator.Client(c.Context(), token)
		client := spotify.New(httpClient)

		ctxt.SetSpotifyClient(c, client)
		return c.Next()
	}
}

// needs to be changed in future. currently setting a client creds client in session store for each user
// i think there should be a way to set a single client creds client for the entire application
func (m *Middleware) WithSpotifyClient() fiber.Handler {
	return func(c *fiber.Ctx) error {
		fmt.Println("WithSpotifyClient")
		token, err := m.sessionStore.GetClientCredsToken(c)
		if err != nil {
			return err
		}

		if token == nil {
			config := &clientcredentials.Config{
				ClientID:     m.clientID,
				ClientSecret: m.clientSecret,
				TokenURL:     spotifyauth.TokenURL,
			}

			token, err = config.Token(c.Context())
			if err != nil {
				return err
			}

			if err := m.sessionStore.SetClientCredsToken(c, token); err != nil {
				return err
			}
		}

		httpClient := spotifyauth.Authenticator{}.Client(c.Context(), token)
		client := spotify.New(httpClient)

		ctxt.SetSpotifyClient(c, client)
		return c.Next()
	}
}
