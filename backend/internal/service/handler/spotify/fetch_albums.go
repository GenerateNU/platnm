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

type AddedContent struct {
	Albums  []*models.Album
	Artists []*models.Artist
}

func (h *SpotifyHandler) GetNewReleases(c *fiber.Ctx) error {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	releases, err := client.NewReleases(c.Context(), spotify.Limit(20))
	if err != nil {
		return err
	}

	albums := []*models.Album{}
	artists := []*models.Artist{}

	fmt.Printf("releases.Albums: %v", releases.Albums[0])

	for _, album := range releases.Albums {

		fmt.Println("looking for album: ", album.Name)
		albumId, err := h.MediaRepository.GetExistingAlbumBySpotifyID(c.Context(), album.ID.String())
		if err != nil {
			return err
		}

		if albumId != nil {
			break // don't add the album or corresponding artists if the album already exists
		}

		newAlbum, err := h.MediaRepository.AddAlbum(c.Context(), &models.Album{
			SpotifyID:   album.ID.String(),
			Title:       album.Name,
			ReleaseDate: album.ReleaseDateTime(),
			Cover:       album.Images[0].URL,
			Country:     album.AvailableMarkets[0],
		})
		if err != nil {
			return err
		}
		albums = append(albums, newAlbum)

		if len(album.Artists) == 0 {
			fmt.Println("album.Artists is nil or empty")
			return fiber.NewError(fiber.StatusBadRequest, "No artists found in the album")
		}

		for _, artist := range album.Artists {
			artistId, err := h.MediaRepository.GetExistingArtistBySpotifyID(c.Context(), artist.ID.String())
			if err != nil {
				return err
			}

			/* TODO: it's possible that the artist can exist but not be detected by spotifyID lookup
			   if it was created through an analogous Apple Music pathway
			   we need more sophisticated artist search logic, but are limited by the overlap betweem the two APIs
			   the only 100% shared data point is the artist name, which is not unique, posing a problem.
			   for now, we'll just create a new artist if one doesn't exist */

			if artistId == nil {
				artist, err := h.MediaRepository.AddArtist(c.Context(), &models.Artist{
					SpotifyID: artist.ID.String(),
					Name:      artist.Name,
				})
				if err != nil {
					return err
				}

				artistId = &artist.ID

				artists = append(artists, artist)
			}

			err = h.MediaRepository.AddAlbumArtist(c.Context(), newAlbum.ID, *artistId)
			if err != nil {
				return err
			}
		}
	}

	addedContent := &AddedContent{
		Albums:  albums,
		Artists: artists,
	}

	return c.Status(fiber.StatusOK).JSON(addedContent)
}
