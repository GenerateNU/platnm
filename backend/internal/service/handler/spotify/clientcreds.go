package spotify

import (
	"platnm/internal/config"
	"platnm/internal/errs"

	"github.com/gofiber/fiber/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"

	"github.com/zmb3/spotify/v2"
	"golang.org/x/oauth2/clientcredentials"
)

type SpotifyCredentials struct {
	ClientID     string
	ClientSecret string
}

type spotifyKey struct{}

func setSpotifyCredentials(c *fiber.Ctx, client spotify.Client) {
	c.Locals(spotifyKey{}, client)
}

func getSpotifyCredentials(c *fiber.Ctx) (spotify.Client, error) {
	client, ok := c.Locals(spotifyKey{}).(spotify.Client)
	if !ok {
		return spotify.Client{}, errs.InternalServerError()
	}
	return client, nil
}

func WithSpotify(config config.Spotify) fiber.Handler {
	return func(c *fiber.Ctx) error {
		config := &clientcredentials.Config{
			ClientID:     config.ClientID,
			ClientSecret: config.ClientSecret,
			TokenURL:     spotifyauth.TokenURL,
		}

		token, err := config.Token(c.Context())
		if err != nil {
			return err
		}

		httpClient := spotifyauth.New().Client(c.Context(), token)
		client := spotify.New(httpClient)

		setSpotifyCredentials(c, *client)
		return c.Next()
	}
}
