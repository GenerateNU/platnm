package spotify

import (
	"platnm/internal/config"
	"platnm/internal/service/ctxt"
	"platnm/internal/storage"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	spotifyauth "github.com/zmb3/spotify/v2/auth"

	"github.com/zmb3/spotify/v2"
	"golang.org/x/oauth2/clientcredentials"
)

type Middleware struct {
	clientID           string
	clientSecret       string
	redirectURI        string
	userAuthRepository storage.UserAuthRepository
}

func NewMiddleware(config config.Spotify, userAuthRepository storage.UserAuthRepository) *Middleware {
	return &Middleware{
		clientID:           config.ClientID,
		clientSecret:       config.ClientSecret,
		redirectURI:        config.RedirectURI,
		userAuthRepository: userAuthRepository,
	}
}

func (m *Middleware) WithAuthenticatedSpotifyClient() fiber.Handler {
	return func(c *fiber.Ctx) error {
		uid, err := uuid.Parse(c.Params("userID"))
		if err != nil {
			return err
		}

		token, err := m.userAuthRepository.GetToken(c.Context(), uid)
		if err != nil {
			return err
		}

		// client id and secret are required to refresh the token
		authenticator := spotifyauth.New(
			spotifyauth.WithClientID(m.clientID),
			spotifyauth.WithClientSecret(m.clientSecret),
		)
		httpClient := authenticator.Client(c.Context(), &token)
		client := spotify.New(httpClient)

		ctxt.SetSpotifyClient(c, client)
		return c.Next()
	}
}

func (m *Middleware) WithSpotifyClient() fiber.Handler {
	return func(c *fiber.Ctx) error {
		config := &clientcredentials.Config{
			ClientID:     m.clientID,
			ClientSecret: m.clientSecret,
			TokenURL:     spotifyauth.TokenURL,
		}

		token, err := config.Token(c.Context())
		if err != nil {
			return err
		}

		httpClient := spotifyauth.Authenticator{}.Client(c.Context(), token)
		client := spotify.New(httpClient)

		ctxt.SetSpotifyClient(c, client)
		return c.Next()
	}
}
