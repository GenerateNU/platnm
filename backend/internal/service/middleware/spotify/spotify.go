package spotify

import (
	"context"
	"crypto/tls"
	"net/http"
	"platnm/internal/config"
	"platnm/internal/service/ctxt"

	"github.com/gofiber/fiber/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"

	"github.com/zmb3/spotify/v2"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
)

type Middleware struct {
	clientID     string
	clientSecret string
	httpClient   *http.Client
}

func NewMiddleware(config config.Spotify) (m *Middleware) {
	cert, err := tls.LoadX509KeyPair("server.crt", "server.key")
	if err != nil {
		panic(err)
	}

	m = new(Middleware)

	m.httpClient = &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				Certificates: []tls.Certificate{cert},
			},
		},
	}

	m.clientID = config.ClientID
	m.clientSecret = config.ClientSecret

	return
}

func (m *Middleware) WithSpotifyClient() fiber.Handler {
	return func(c *fiber.Ctx) error {
		config := &clientcredentials.Config{
			ClientID:     m.clientID,
			ClientSecret: m.clientSecret,
			TokenURL:     spotifyauth.TokenURL,
		}

		ctx := context.WithValue(c.Context(), oauth2.HTTPClient, m.httpClient)
		token, err := config.Token(ctx)
		if err != nil {
			return err
		}

		httpClient := spotifyauth.New().Client(ctx, token)
		client := spotify.New(httpClient)

		ctxt.SetSpotifyClient(c, client)
		return c.Next()
	}
}
