package spotify

import (
	"fmt"
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

	fmt.Println(releases.Albums[0])
	albums := []*models.Album{}
	// albumArtists := []*AlbumArtist{}
	// addedAlbumCount := 0

	for _, album := range releases.Albums {
		fmt.Printf("Full album object: %+v\n", album)

		fmt.Println("album: ", album.Name)

		// Check if album.Artists is nil or empty before accessing
		if album.Artists == nil || len(album.Artists) == 0 {
			fmt.Println("album.Artists is nil or empty")
			return fiber.NewError(fiber.StatusBadRequest, "No artists found in the album")
		}

		// Check if the first artist in the list is nil
		if &album.Artists[0] == nil {
			fmt.Println("album.Artists[0] is nil")
			return fiber.NewError(fiber.StatusBadRequest, "Artist data missing")
		}

		fmt.Println("artist: ", album.Artists[0].ID.String())

		artistId, err := h.MediaRepository.GetExistingArtistBySpotifyID(c.Context(), "06HL4z0CvFAxyc27GXpf02")
		if err != nil {
			return err
		}
		fmt.Println("made to 41")
		if artistId == nil {
			println("adding artist: ", album.Artists[0].Name)
			artist, err := h.MediaRepository.AddArtist(c.Context(), &models.Artist{
				SpotifyID: album.Artists[0].ID.String(),
				Name:      album.Artists[0].Name,
			})
			if err != nil {
				return err
			}
			artistId = &artist.ID
			println("got artistID: ", artistId)
		}
		println("made to 54")

		// albumId, err := h.MediaRepository.GetExistingAlbumBySpotifyID(c.Context(), album.Artists[0].ID.String())
		// if err != nil {
		// 	return err
		// }
		// if albumId == nil {
		// 	album, err := h.MediaRepository.AddAlbum(c.Context(), &models.Album{
		// 		SpotifyID:   album.ID.String(),
		// 		Title:       album.Name,
		// 		ReleaseDate: album.ReleaseDateTime(),
		// 		Cover:       album.Images[0].URL,
		// 		Country:     album.AvailableMarkets[0],
		// 	})
		// 	if err != nil {
		// 		return err
		// 	}
		// 	addedAlbumCount++
		// 	albumId = &album.ID
		// }

		// albumArtists = append(albumArtists, &AlbumArtist{
		// 	AlbumID:  *albumId,
		// 	ArtistID: artistId})
	}

	return c.Status(fiber.StatusOK).JSON(albums)
}
