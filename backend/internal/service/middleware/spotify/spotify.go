package spotify

import (
	"platnm/internal/config"
	"platnm/internal/service/ctxt"

	"github.com/gofiber/fiber/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"

	"github.com/zmb3/spotify/v2"
	"golang.org/x/oauth2/clientcredentials"
)

type Middleware struct {
	clientID     string
	clientSecret string
}

func NewMiddleware(config config.Spotify) *Middleware {
	return &Middleware{
		clientID:     config.ClientID,
		clientSecret: config.ClientSecret,
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

		httpClient := spotifyauth.New().Client(c.Context(), token)
		client := spotify.New(httpClient)

		ctxt.SetSpotifyClient(c, client)
		return c.Next()
	}
}
