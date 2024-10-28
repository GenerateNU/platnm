package spotify

import (
	"context"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"platnm/internal/storage"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

type populateRequest struct {
	Artists []string `json:"artists"`
	Tracks  []string `json:"tracks"`
	Genres  []string `json:"genres"`
}

func (h *SpotifyHandler) PopulateRecommendations(c *fiber.Ctx) error {
	var req populateRequest
	if err := c.BodyParser(&req); err != nil {
		return err
	}

	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	seeds := req.toSeeds()
	recommendations, err := client.GetRecommendations(c.Context(), seeds, nil)
	if err != nil {
		return err
	}

	go handleRecommendations(recommendations, h.mediaRepository)
	return c.SendStatus(fiber.StatusAccepted)
}

func handleRecommendations(recommendations *spotify.Recommendations, mr storage.MediaRepository) {
	var wg sync.WaitGroup
	for _, track := range recommendations.Tracks {
		// for _, artist := range track.Artists {
		// 	wg.Add(1)
		// 	go handleArtist(artist, mr, &wg)
		// }
		// wg.Add(2)
		// go handleTrack(track, mr, &wg)
		wg.Add(1)
		go handleAlbum(track.Album, mr, &wg)
	}

	wg.Wait()
}

// func handleArtist(artist spotify.SimpleArtist, mr storage.MediaRepository, wg *sync.WaitGroup) {}

// func handleTrack(track spotify.SimpleTrack, mr storage.MediaRepository, wg *sync.WaitGroup) {}

func handleAlbum(album spotify.SimpleAlbum, mr storage.MediaRepository, wg *sync.WaitGroup) {
	defer wg.Done()
	a := models.Album{
		MediaType:   models.AlbumMedia,
		SpotifyID:   album.ID.String(),
		Title:       album.Name,
		ReleaseDate: album.ReleaseDateTime(),
		Cover:       album.Images[0].URL,
	}

	_, err := mr.AddAlbum(context.TODO(), &a)
	if err != nil {
		// TODO: handle error
	}
}

func (pr *populateRequest) toSeeds() spotify.Seeds {
	artistIDs := make([]spotify.ID, len(pr.Artists))
	for i, artist := range pr.Artists {
		artistIDs[i] = spotify.ID(artist)
	}

	trackIDs := make([]spotify.ID, len(pr.Tracks))
	for i, track := range pr.Tracks {
		trackIDs[i] = spotify.ID(track)
	}
	return spotify.Seeds{
		Artists: artistIDs,
		Tracks:  trackIDs,
		Genres:  pr.Genres,
	}
}
