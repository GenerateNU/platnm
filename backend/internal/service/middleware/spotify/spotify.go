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
	ClientID     string
	ClientSecret string
}

func NewMiddleware(config config.Spotify) *Middleware {
	return &Middleware{
		ClientID:     config.ClientID,
		ClientSecret: config.ClientSecret,
	}
}

func (m *Middleware) WithSpotifyClient() fiber.Handler {
	return func(c *fiber.Ctx) error {
		config := &clientcredentials.Config{
			ClientID:     m.ClientID,
			ClientSecret: m.ClientSecret,
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
