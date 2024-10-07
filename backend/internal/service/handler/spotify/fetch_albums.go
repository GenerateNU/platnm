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

type AddedContent struct {
	Albums  []*models.Album
	Artists []*models.Artist
}

func (h *SpotifyHandler) GetNewReleases(c *fiber.Ctx) error {
	newReleases, err := fetchNewReleasesFromSpotify(c)
	if err != nil {
		return err
	}

	addedContent := &AddedContent{}
	for _, album := range newReleases.Albums {
		if err := h.handleAlbum(c, album, addedContent); err != nil {
			return err
		}
	}

	return c.Status(fiber.StatusOK).JSON(addedContent)
}

func (h *SpotifyHandler) handleAlbum(c *fiber.Ctx, album spotify.SimpleAlbum, addedContent *AddedContent) error {
	albumId, err := h.MediaRepository.GetExistingAlbumBySpotifyID(c.Context(), album.ID.String())
	if err != nil {
		return err
	}

	if albumId != nil {
		return nil
	}

	addedAlbum, err := h.MediaRepository.AddAlbum(c.Context(), &models.Album{
		SpotifyID:   album.ID.String(),
		Title:       album.Name,
		ReleaseDate: album.ReleaseDateTime(),
		Cover:       album.Images[0].URL,
	})

	if err != nil {
		return err
	}

	for _, artist := range album.Artists {
		if err := h.handleArtist(c, artist, addedContent, addedAlbum.ID); err != nil {
			return err
		}
	}

	addedContent.Albums = append(addedContent.Albums, addedAlbum)
	return nil
}

func (h *SpotifyHandler) handleArtist(c *fiber.Ctx, artist spotify.SimpleArtist, addedContent *AddedContent, albumId int) error {
	/* TODO: it's possible that the artist can exist but not be detected by spotifyID lookup if it was
	created through a future analogous Apple Music pathway.
	we need more sophisticated artist search logic, but are limited by the overlap betweem the two APIs.
	the only 100% shared data point is the artist name, which is not unique, posing a problem.
	for now, we'll just create a new artist if one doesn't exist */
	artistId, err := h.MediaRepository.GetExistingArtistBySpotifyID(c.Context(), artist.ID.String())
	if err != nil {
		return err
	}
	if artistId == nil {
		newArtist, err := h.MediaRepository.AddArtist(c.Context(), &models.Artist{
			SpotifyID: artist.ID.String(),
			Name:      artist.Name,
		})
		if err != nil {
			return err
		}
		artistId = &newArtist.ID
		addedContent.Artists = append(addedContent.Artists, newArtist)
	}

	err = h.MediaRepository.AddAlbumArtist(c.Context(), albumId, *artistId)
	if err != nil {
		return err
	}

	return nil
}

func fetchNewReleasesFromSpotify(c *fiber.Ctx) (*spotify.SimpleAlbumPage, error) {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return &spotify.SimpleAlbumPage{}, err
	}

	return client.NewReleases(c.Context(), spotify.Limit(20))
}
