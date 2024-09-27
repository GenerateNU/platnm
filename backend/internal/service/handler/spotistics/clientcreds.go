package spotistics

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"

	"github.com/zmb3/spotify/v2"
	"golang.org/x/oauth2/clientcredentials"
)

type SpotifyCredentials struct {
	ClientID     string
	ClientSecret string
}

type SpotifyKey struct{}

func (creds *SpotifyCredentials) getClient() spotify.Client {
	ctx := context.Background()
	config := &clientcredentials.Config{
		ClientID:     creds.ClientID,
		ClientSecret: creds.ClientSecret,
		TokenURL:     spotifyauth.TokenURL,
	}

	token, err := config.Token(ctx)
	if err != nil {
		log.Fatalf("Couldn't get token: %v", err)
	}

	httpClient := spotifyauth.New().Client(ctx, token)
	client := spotify.New(httpClient)
	return *client
}

func WithSpotify() fiber.Handler {
	return func(c *fiber.Ctx) error {
		creds := &SpotifyCredentials{
			ClientID:     os.Getenv("SPOTIFY_ID"),
			ClientSecret: os.Getenv("SPOTIFY_SECRET"),
		}
		client := creds.getClient()

		c.Locals(SpotifyKey{}, client)
		return c.Next()
	}
}
