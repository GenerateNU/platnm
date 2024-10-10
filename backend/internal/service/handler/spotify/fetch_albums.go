package spotify

import (
	"context"
	"errors"
	"fmt"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"strconv"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

type AlbumArtist struct {
	AlbumID  int
	ArtistID int
}

type Response struct {
	Albums  []models.Album  `json:"albums"`
	Artists []models.Artist `json:"artists"`
}

func (h *SpotifyHandler) GetNewReleases(c *fiber.Ctx) error {
	newReleases, err := fetchNewReleasesFromSpotify(c)
	if err != nil {
		return err
	}

	numJobs := len(newReleases.Albums)

	albums := make(chan models.Album, numJobs)

	artists := make(chan models.Artist)

	errCh := make(chan error)

	var wg sync.WaitGroup

	go func() {
		wg.Wait()
		close(albums)
		close(artists)
		close(errCh)
	}()

	for _, album := range newReleases.Albums {
		// assuming I should handle each album concurrently?
		// do I also handle each artist/track concurrently?
		wg.Add(1)
		go func(album spotify.SimpleAlbum) { // Capture the album variable to avoid race condition
			defer wg.Done()
			if err := h.handleAlbum(c, &wg, album, albums, artists, errCh); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
		}(album)
	}

	wg.Wait()

	fmt.Println("done waiting")

	var errs []error
	for err := range errCh {
		errs = append(errs, err)
	}
	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	// Read all the albums and artists from the channels
	var rAlbums []models.Album
	for album := range albums {
		rAlbums = append(rAlbums, album)
	}

	var rArtists []models.Artist
	for artist := range artists {
		rArtists = append(rArtists, artist)
	}

	return c.Status(fiber.StatusOK).JSON(Response{
		Albums:  rAlbums,
		Artists: rArtists,
	})
}

func (h *SpotifyHandler) handleAlbum(c *fiber.Ctx, wg *sync.WaitGroup, album spotify.SimpleAlbum, albums chan<- models.Album, artists chan<- models.Artist, errCh chan<- error) error {
	albumId, err := h.MediaRepository.GetExistingAlbumBySpotifyID(c.Context(), album.ID.String())

	if err != nil {
		return err
	}

	if albumId != nil {
		return nil
	}

	addedAlbum, err := h.MediaRepository.AddAlbum(c.Context(), &models.Album{
		MediaType:   models.AlbumMedia,
		SpotifyID:   album.ID.String(),
		Title:       album.Name,
		ReleaseDate: album.ReleaseDateTime(),
		Cover:       album.Images[0].URL,
	})

	if err != nil {
		return err
	}

	for _, artist := range album.Artists {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := h.handleArtist(c.Context(), artist, artists, addedAlbum.ID); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

		}()
	}

	select {
	case albums <- *addedAlbum:
	default:
	}
	return nil

}

func (h *SpotifyHandler) handleArtist(ctx context.Context, artist spotify.SimpleArtist, artists chan<- models.Artist, albumId int) error {
	/* TODO: it's possible that the artist can exist but not be detected by spotifyID lookup if it was
	created through a future analogous Apple Music pathway.
	we need more sophisticated artist search logic, but are limited by the overlap betweem the two APIs.
	the only 100% shared data point is the artist name, which is not unique, posing a problem.
	for now, we'll just create a new artist if one doesn't exist */
	artistId, err := h.MediaRepository.GetExistingArtistBySpotifyID(ctx, artist.ID.String())
	if err != nil {
		return err
	}
	if artistId == nil {
		newArtist, err := h.MediaRepository.AddArtist(ctx, &models.Artist{
			SpotifyID: artist.ID.String(),
			Name:      artist.Name,
		})
		if err != nil {
			return err
		}
		artistId = &newArtist.ID
		select {
		case artists <- *newArtist:
		default:
		}
	}

	if err := h.MediaRepository.AddAlbumArtist(ctx, albumId, *artistId); err != nil {
		return err
	}

	return nil
}

func fetchNewReleasesFromSpotify(c *fiber.Ctx) (*spotify.SimpleAlbumPage, error) {
	limit, err := strconv.Atoi(c.Query("limit", "20"))
	if err != nil {
		return &spotify.SimpleAlbumPage{}, err
	}

	fmt.Println(limit)
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return &spotify.SimpleAlbumPage{}, err
	}

	return client.NewReleases(c.Context(), spotify.Limit(limit))
}
