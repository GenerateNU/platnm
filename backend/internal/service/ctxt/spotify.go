package ctxt

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

type spotifyKey struct{}

func SetSpotifyClient(c *fiber.Ctx, client *spotify.Client) {
	c.Locals(spotifyKey{}, client)
}

func GetSpotifyClient(c *fiber.Ctx) (*spotify.Client, error) {
	client, ok := c.Locals(spotifyKey{}).(*spotify.Client)
	if !ok {
		return nil, fmt.Errorf("unexpected spotify client. got: %v", client)
	}
	return client, nil
}
