package spotify

import (
	"context"
	"errors"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

type newReleasesResponse struct {
	Albums  []models.Album  `json:"albums"`
	Tracks  []models.Track  `json:"tracks"`
	Artists []models.Artist `json:"artists"`
}

func (h *SpotifyHandler) NewReleases(c *fiber.Ctx) error {
	newReleases, err := fetchNewReleasesFromSpotify(c)
	if err != nil {
		return err
	}

	var (
		numJobs = len(newReleases.Albums)
		albums  = make(chan models.Album, numJobs)
		tracks  = make(chan models.Track, numJobs)
		artists = make(chan models.Artist)
		errCh   = make(chan error)
		wg      sync.WaitGroup
	)

	go func() {
		wg.Wait()
		close(albums)
		close(tracks)
		close(artists)
		close(errCh)
	}()

	for _, album := range newReleases.Albums {
		wg.Add(1)
		go func(album spotify.SimpleAlbum) {
			defer wg.Done()
			albumId, err := h.handleAlbum(c.Context(), &wg, album, albums, artists, errCh)

			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
			err = h.handleTracks(c, &wg, *albumId, album.ID, tracks, errCh)
			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
		}(album)
	}

	wg.Wait()

	var errs []error
	for err := range errCh {
		errs = append(errs, err)
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	var rAlbums []models.Album
	for album := range albums {
		rAlbums = append(rAlbums, album)
	}

	var rTracks []models.Track
	for track := range tracks {
		rTracks = append(rTracks, track)
	}

	var rArtists []models.Artist
	for artist := range artists {
		rArtists = append(rArtists, artist)
	}

	return c.
		Status(fiber.StatusOK).
		JSON(
			newReleasesResponse{
				Albums:  rAlbums,
				Tracks:  rTracks,
				Artists: rArtists,
			},
		)
}

func (h *SpotifyHandler) handleAlbum(ctx context.Context, wg *sync.WaitGroup, album spotify.SimpleAlbum, albums chan<- models.Album, artists chan<- models.Artist, errCh chan<- error) (*int, error) {
	albumId, err := h.mediaRepository.GetExistingAlbumBySpotifyID(ctx, album.ID.String())
	if err != nil {
		return nil, err
	}

	if albumId != nil {
		return albumId, nil
	}

	addedAlbum, err := h.mediaRepository.AddAlbum(ctx, &models.Album{
		MediaType:   models.AlbumMedia,
		SpotifyID:   album.ID.String(),
		Title:       album.Name,
		ReleaseDate: album.ReleaseDateTime(),
		Cover:       album.Images[0].URL,
	})
	if err != nil {
		return nil, err
	}

	for _, artist := range album.Artists {
		wg.Add(1)
		go func(artist spotify.SimpleArtist) {
			defer wg.Done()
			if err := h.handleArtist(ctx, artist, artists, addedAlbum.ID); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

		}(artist)
	}

	albums <- *addedAlbum

	return &addedAlbum.ID, nil

}

func (h *SpotifyHandler) handleArtist(ctx context.Context, artist spotify.SimpleArtist, artists chan<- models.Artist, albumId int) error {
	/* TODO: it's possible that the artist can exist but not be detected by spotifyID lookup if it was
	created through a future analogous Apple Music pathway.
	we need more sophisticated artist search logic, but are limited by the overlap betweem the two APIs.
	the only 100% shared data point is the artist name, which is not unique, posing a problem.
	for now, we'll just create a new artist if one doesn't exist */
	artistId, err := h.mediaRepository.GetExistingArtistBySpotifyID(ctx, artist.ID.String())
	if err != nil {
		return err
	}
	if artistId == nil {
		newArtist, err := h.mediaRepository.AddArtist(ctx, &models.Artist{
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

	if err := h.mediaRepository.AddAlbumArtist(ctx, albumId, *artistId); err != nil {
		return err
	}

	return nil
}

func fetchNewReleasesFromSpotify(c *fiber.Ctx) (*spotify.SimpleAlbumPage, error) {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return &spotify.SimpleAlbumPage{}, err
	}

	limit := c.QueryInt("limit", 20)

	return client.NewReleases(c.Context(), spotify.Limit(limit))
}

func fetchAlbumTracksFromSpotify(c *fiber.Ctx, id spotify.ID) (*spotify.SimpleTrackPage, error) {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return &spotify.SimpleTrackPage{}, err
	}

	return client.GetAlbumTracks(c.Context(), id)
}

func (h *SpotifyHandler) handleTracks(c *fiber.Ctx, wg *sync.WaitGroup, albumId int, spotifyID spotify.ID, tracks chan<- models.Track, errCh chan<- error) error {
	spotifyTracks, err := fetchAlbumTracksFromSpotify(c, spotifyID)
	if err != nil {
		return err
	}

	for _, t := range spotifyTracks.Tracks {
		wg.Add(1)
		go func(t spotify.SimpleTrack) {
			defer wg.Done()

			trackResult, err := h.mediaRepository.AddTrack(c.Context(), &models.Track{
				SpotifyID: t.ID.String(),
				AlbumID:   albumId,
				Title:     t.Name,
				Duration:  int(t.Duration / 1000)})

			if err != nil {
				select {
				case errCh <- err:
				default:
				}
			}

			select {
			case tracks <- *trackResult:
			default:
			}

			// get the Spotify artists associated with this track and add a record for each
			for _, artist := range t.Artists {
				artistId, err := h.mediaRepository.GetExistingArtistBySpotifyID(c.Context(), artist.ID.String())
				if err != nil {
					select {
					case errCh <- err:
					default:
					}
				}

				if artistId == nil {
					newArtist, err := h.mediaRepository.AddArtist(c.Context(), &models.Artist{
						SpotifyID: artist.ID.String(),
						Name:      artist.Name,
					})
					if err != nil {
						select {
						case errCh <- err:
						default:
						}
					}
					artistId = &newArtist.ID
				}
				err = h.mediaRepository.AddTrackArtist(c.Context(), trackResult.ID, *artistId)
				if err != nil {
					select {
					case errCh <- err:
					default:
					}
				}
			}
		}(t)
	}
	return nil
}
