package spotify

import (
	"platnm/internal/models"
	"platnm/internal/service/ctxt"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

type AlbumArtist struct {
	AlbumID  int
	ArtistID int
}

func (h *SpotifyHandler) GetNewReleases(c *fiber.Ctx) error {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	// options := spotify.RequestOption{
	// 	Country: "US",
	// }

	releases, err := client.NewReleases(c.Context(), spotify.Limit(10))
	if err != nil {
		return err
	}

	albums := []*models.Album{}
	// albumArtists := []*AlbumArtist{}

	for _, album := range releases.Albums {

		artist, err := h.MediaRepository.GetExistingArtistBySpotifyID(c.Context(), album.Artists[0].ID.String())
		if err != nil {
			return err
		}
		if artist == nil {
			h.MediaRepository.AddArtist(c.Context(), &models.Artist{
				SpotifyID: album.Artists[0].ID.String(),
				Name:      album.Artists[0].Name,
			})
		}

		albums = append(albums, &models.Album{
			SpotifyID:   album.ID.String(),
			Title:       album.Name,
			ReleaseDate: album.ReleaseDateTime(),
			Cover:       album.Images[0].URL,
			Country:     album.AvailableMarkets[0]})

		// albumArtists = append(albumArtists, &AlbumArtist{
		// 	AlbumID:  album.ID, // this ID needs to come from the database.
		// 	ArtistID: album.Artists[0].ID.String()}) // this artistID also needs to come from the database...
	}

	return c.Status(fiber.StatusOK).JSON(albums)
}
