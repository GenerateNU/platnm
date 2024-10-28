package spotify

import (
	"context"
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

	go handleRecommendations(recommendations, h.mediaRepository)
	return c.SendStatus(fiber.StatusAccepted)
}

func handleRecommendations(recommendations *spotify.Recommendations, mr storage.MediaRepository) {
	// insert artists in a separate goroutine since artist schema is independent of track and album
	artistsResults := handleArtists(recommendations, mr)

	// insert albums and tracks in a pipeline pattern since track schema has a foreign key to album
	stage1 := generateJobs(recommendations)
	stage2 := handleAlbums(stage1, mr)
	pipelineResults := handleTracks(stage2, mr)

	select {
	case ar := <-artistsResults:
		if ar.err != nil {
			// warn or error here?
			slog.Warn("failed to import artist",
				"error", ar.err.Error(),
			)
		}
	case pr := <-pipelineResults:
		if pr.albumErr != nil {
			// warn or error here?
			slog.Warn("failed to import album",
				"error", pr.albumErr.Error(),
			)
		} else if pr.trackErr != nil {
			// warn or error here?
			slog.Warn("failed to import track",
				"error", pr.trackErr.Error(),
			)
		}
	}
}

type job struct {
	track    spotify.SimpleTrack
	albumID  int
	albumErr error
	trackErr error
}

type artistResult struct {
	err error
}

func generateJobs(recommendations *spotify.Recommendations) <-chan job {
	out := make(chan job)
	go func() {
		defer close(out)
		for _, track := range recommendations.Tracks {
			out <- job{track: track}
		}
	}()
	return out
}

func handleAlbums(in <-chan job, mr storage.MediaRepository) <-chan job {
	out := make(chan job)
	go func() {
		defer close(out)
		// map that stores spotify album ids to album ids in our database
		// this prevents attempts to add duplicate albums
		albums := make(map[string]int)

		for j := range in {
			if id, ok := albums[j.track.Album.ID.String()]; ok {
				j.albumID = id
			} else {
				if album, err := mr.AddAlbum(context.TODO(), &models.Album{
					MediaType:   models.AlbumMedia,
					SpotifyID:   j.track.Album.ID.String(),
					Title:       j.track.Album.Name,
					ReleaseDate: j.track.Album.ReleaseDateTime(),
					Cover:       j.track.Album.Images[0].URL,
				}); err != nil {
					j.albumErr = err
				} else {
					j.albumID = album.ID
					albums[j.track.Album.ID.String()] = album.ID
				}
			}

			out <- j
		}
	}()
	return out
}

func handleTracks(in <-chan job, mr storage.MediaRepository) <-chan job {
	out := make(chan job)
	go func() {
		defer close(out)

		for j := range in {
			if j.albumErr != nil {
				if _, err := mr.AddTrack(context.TODO(), &models.Track{
					MediaType:   models.TrackMedia,
					SpotifyID:   j.track.ID.String(),
					AlbumID:     j.albumID,
					Title:       j.track.Name,
					Duration:    int(j.track.Duration),
					ReleaseDate: j.track.Album.ReleaseDateTime(),
					Cover:       j.track.Album.Images[0].URL,
				}); err != nil {
					j.trackErr = err
				}
			}

			out <- j
		}
	}()
	return out
}

func handleArtists(recommendations *spotify.Recommendations, mr storage.MediaRepository) <-chan artistResult {
	results := make(chan artistResult)
	go func() {
		defer close(results)
		var wg sync.WaitGroup
		// map that stores spotify artist ids that have already been added to the database
		artists := make(map[string]struct{})

		for _, track := range recommendations.Tracks {
			for _, artist := range track.Artists {
				if _, ok := artists[artist.ID.String()]; !ok {
					wg.Add(1)
					go func() {
						defer wg.Done()
						if _, err := mr.AddArtist(context.TODO(), &models.Artist{
							SpotifyID: artist.ID.String(),
							Name:      artist.Name,
						}); err != nil {
							results <- artistResult{err: err}
						} else {
							artists[artist.ID.String()] = struct{}{}
						}
					}()
				}
			}
		}

		wg.Wait()
	}()

	return results
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
