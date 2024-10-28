package spotify

import (
	"context"
	"errors"
	"log/slog"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"platnm/internal/storage"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

type importRecommendationsRequest struct {
	Artists []string `json:"artists"`
	Tracks  []string `json:"tracks"`
	Genres  []string `json:"genres"`
}

type importRecommendationsResponse struct {
	Artists []models.Artist `json:"artists"`
	Tracks  []models.Track  `json:"tracks"`
	Albums  []models.Album  `json:"albums"`
}

func (h *SpotifyHandler) ImportRecommendations(c *fiber.Ctx) error {
	var req importRecommendationsRequest
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

	resp := handleRecommendations(c.Context(), recommendations, h.mediaRepository)
	return c.Status(fiber.StatusOK).JSON(resp)
}

func handleRecommendations(ctx context.Context, recommendations *spotify.Recommendations, mr storage.MediaRepository) importRecommendationsResponse {
	var (
		resp    importRecommendationsResponse
		wg      sync.WaitGroup
		errCh   = make(chan error)
		allErrs []error
	)

	// collect errors from goroutines
	go func() {
		for err := range errCh {
			allErrs = append(allErrs, err)
		}
	}()

	// insert artists outside of pipeline since artist schema is independent of track and album
	artistResults := handleArtists(ctx, recommendations, errCh, mr)

	// insert albums and tracks in pipeline pattern since track schema has a foreign key to album
	stage1 := startPipeline(recommendations)
	stage2, albumResults := handleAlbums(ctx, stage1, errCh, mr)
	trackResults := handleTracks(ctx, stage2, errCh, mr)

	wg.Add(3)

	// collect inserted artists
	go func() {
		defer wg.Done()
		for ar := range artistResults {
			resp.Artists = append(resp.Artists, ar)
		}
	}()

	// collect inserted albums
	go func() {
		defer wg.Done()
		for ar := range albumResults {
			resp.Albums = append(resp.Albums, ar)
		}
	}()

	// collect inserted tracks
	go func() {
		defer wg.Done()
		for tr := range trackResults {
			resp.Tracks = append(resp.Tracks, tr)
		}
	}()

	// wait until all goroutines are done
	// close errCh since no more goroutines will be sending errors
	wg.Wait()
	close(errCh)

	if len(allErrs) > 0 {
		slog.Warn("error importing recommendations",
			"errors", errors.Join(allErrs...),
		)
	}

	return resp
}

func startPipeline(recommendations *spotify.Recommendations) <-chan spotify.SimpleTrack {
	out := make(chan spotify.SimpleTrack)
	go func() {
		defer close(out)
		for _, track := range recommendations.Tracks {
			out <- track
		}
	}()
	return out
}

type trackWithAlbumID struct {
	track   spotify.SimpleTrack
	albumID int
}

func handleAlbums(ctx context.Context, in <-chan spotify.SimpleTrack, errChan chan<- error, mr storage.MediaRepository) (<-chan trackWithAlbumID, <-chan models.Album) {
	var (
		out          = make(chan trackWithAlbumID)
		albumResults = make(chan models.Album)
	)

	go func() {
		defer func() {
			close(out)
			close(albumResults)
		}()
		var mu sync.Mutex
		// map that stores spotify album ids to album ids in our database
		// this prevents attempts to add duplicate albums
		albums := make(map[string]int)

		for track := range in {
			mu.Lock()
			id, ok := albums[track.Album.ID.String()]
			mu.Unlock()

			// if the album is already in the database, skip adding album to db
			// and send track to next stage with corresponding album id
			if ok {
				out <- trackWithAlbumID{
					track:   track,
					albumID: id,
				}
			} else {
				var cover string
				if len(track.Album.Images) > 0 {
					cover = track.Album.Images[0].URL
				}

				if album, err := mr.AddAlbum(ctx, &models.Album{
					MediaType:   models.AlbumMedia,
					SpotifyID:   track.Album.ID.String(),
					Title:       track.Album.Name,
					ReleaseDate: track.Album.ReleaseDateTime(),
					Cover:       cover,
				}); err != nil {
					errChan <- err
				} else {
					albumResults <- *album
					out <- trackWithAlbumID{
						track:   track,
						albumID: album.ID,
					}
					albums[track.Album.ID.String()] = album.ID
				}
			}
		}
	}()
	return out, albumResults
}

func handleTracks(ctx context.Context, in <-chan trackWithAlbumID, errChan chan<- error, mr storage.MediaRepository) <-chan models.Track {
	trackResults := make(chan models.Track)

	go func() {
		defer close(trackResults)
		for t := range in {
			var cover string
			if len(t.track.Album.Images) > 0 {
				cover = t.track.Album.Images[0].URL
			}

			if newTrack, err := mr.AddTrack(ctx, &models.Track{
				MediaType:   models.TrackMedia,
				SpotifyID:   t.track.ID.String(),
				AlbumID:     t.albumID,
				Title:       t.track.Name,
				Duration:    int(t.track.Duration),
				ReleaseDate: t.track.Album.ReleaseDateTime(),
				Cover:       cover,
			}); err != nil {
				errChan <- err
			} else {
				trackResults <- *newTrack
			}
		}
	}()

	return trackResults
}

func handleArtists(ctx context.Context, recommendations *spotify.Recommendations, errChan chan<- error, mr storage.MediaRepository) <-chan models.Artist {
	artistResults := make(chan models.Artist)

	go func() {
		defer close(artistResults)
		var (
			wg sync.WaitGroup
			mu sync.Mutex
		)
		// map that stores spotify artist ids that have already been added to the database
		artists := make(map[string]struct{})

		for _, track := range recommendations.Tracks {
			for _, artist := range track.Artists {
				mu.Lock()
				_, ok := artists[artist.ID.String()]
				mu.Unlock()

				if !ok {
					wg.Add(1)
					go func() {
						defer wg.Done()
						if newArtist, err := mr.AddArtist(ctx, &models.Artist{
							SpotifyID: artist.ID.String(),
							Name:      artist.Name,
						}); err != nil {
							errChan <- err
						} else {
							mu.Lock()
							artists[artist.ID.String()] = struct{}{}
							mu.Unlock()
							artistResults <- *newArtist
						}
					}()
				}
			}
		}

		wg.Wait()
	}()

	return artistResults
}

func (irr *importRecommendationsRequest) toSeeds() spotify.Seeds {
	artistIDs := make([]spotify.ID, len(irr.Artists))
	for i, artist := range irr.Artists {
		artistIDs[i] = spotify.ID(artist)
	}

	trackIDs := make([]spotify.ID, len(irr.Tracks))
	for i, track := range irr.Tracks {
		trackIDs[i] = spotify.ID(track)
	}

	return spotify.Seeds{
		Artists: artistIDs,
		Tracks:  trackIDs,
		Genres:  irr.Genres,
	}
}
