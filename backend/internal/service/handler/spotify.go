package handler

import (
	"context"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2/clientcredentials"
)

func configureSpotify() spotify.Client {
	authConfig := &clientcredentials.Config{
		ClientID:     "f3ea536e48fa4d5e9026fd7ffa1eed17",
		ClientSecret: "de69b268a565404aba21c4a531787992",
		TokenURL:     spotify.TokenURL,
	}

	accessToken, err := authConfig.Token(context.Background())
	if err != nil {
		log.Fatalf("couldn't get token: %v", err)
	}

	client := spotify.Authenticator{}.NewClient(accessToken)
	return client
}

func GetPlatnmPlaylist(c *fiber.Ctx) error {
	client := configureSpotify()

	playlistID := spotify.ID("671uu0Y7jiAgX04Ou82Up9?si=80a629645bb84d42")
	playlist, err := client.GetPlaylist(playlistID)
	if err != nil {
		log.Fatalf("couldn't get playlist: %v", err)
	}

	return c.Status(fiber.StatusOK).JSON(playlist)
}
