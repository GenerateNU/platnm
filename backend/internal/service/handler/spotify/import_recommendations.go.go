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

type importRecommendationsRequest struct {
	Artists []string `json:"artists"`
	Tracks  []string `json:"tracks"`
	Genres  []string `json:"genres"`
}

type artistResult struct {
	SpotifyID spotify.ID    `json:"spotify_id"`
	Artist    models.Artist `json:"artist"`
	Err       error         `json:"error"`
}

type trackResult struct {
	SpotifyID spotify.ID   `json:"spotify_id"`
	Track     models.Track `json:"track"`
	Err       error        `json:"error"`
}

type albumResult struct {
	SpotifyID spotify.ID   `json:"spotify_id"`
	Album     models.Album `json:"album"`
	Err       error        `json:"error"`
}

type importRecommendationsResponse struct {
	Artists []artistResult `json:"artists"`
	Tracks  []trackResult  `json:"tracks"`
	Albums  []albumResult  `json:"albums"`
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
	// insert artists in a separate goroutine since artist schema is independent of track and album
	artistResults := handleArtists(ctx, recommendations, mr)

	// insert albums and tracks in a pipeline pattern since track schema has a foreign key to album
	stage1 := generateJobs(recommendations)
	stage2, albumResults := handleAlbums(ctx, stage1, mr)
	trackResults := handleTracks(ctx, stage2, mr)

	resp := importRecommendationsResponse{}

	var wg sync.WaitGroup
	wg.Add(3)

	go func() {
		defer wg.Done()
		for ar := range artistResults {
			resp.Artists = append(resp.Artists, ar)
		}
	}()

	go func() {
		defer wg.Done()
		for ar := range albumResults {
			resp.Albums = append(resp.Albums, ar)
		}
	}()

	go func() {
		defer wg.Done()
		for tr := range trackResults {
			resp.Tracks = append(resp.Tracks, tr)
		}
	}()

	wg.Wait()
	return resp
}

func generateJobs(recommendations *spotify.Recommendations) <-chan spotify.SimpleTrack {
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

func handleAlbums(ctx context.Context, in <-chan spotify.SimpleTrack, mr storage.MediaRepository) (<-chan trackWithAlbumID, <-chan albumResult) {
	var (
		out          = make(chan trackWithAlbumID)
		albumResults = make(chan albumResult)
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
				if album, err := mr.AddAlbum(ctx, &models.Album{
					MediaType:   models.AlbumMedia,
					SpotifyID:   track.Album.ID.String(),
					Title:       track.Album.Name,
					ReleaseDate: track.Album.ReleaseDateTime(),
					Cover:       track.Album.Images[0].URL,
				}); err != nil {
					albumResults <- albumResult{
						SpotifyID: track.Album.ID,
						Err:       err,
					}
				} else {
					albumResults <- albumResult{
						SpotifyID: track.Album.ID,
						Album:     *album,
					}
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

func handleTracks(ctx context.Context, in <-chan trackWithAlbumID, mr storage.MediaRepository) <-chan trackResult {
	trackResults := make(chan trackResult)

	go func() {
		defer close(trackResults)
		for t := range in {
			track := models.Track{
				MediaType:   models.TrackMedia,
				SpotifyID:   t.track.ID.String(),
				AlbumID:     t.albumID,
				Title:       t.track.Name,
				Duration:    int(t.track.Duration),
				ReleaseDate: t.track.Album.ReleaseDateTime(),
				Cover:       t.track.Album.Images[0].URL,
			}

			if newTrack, err := mr.AddTrack(ctx, &track); err != nil {
				trackResults <- trackResult{
					SpotifyID: t.track.ID,
					Err:       err,
				}
			} else {
				trackResults <- trackResult{
					SpotifyID: t.track.ID,
					Track:     *newTrack,
				}
			}
		}
	}()

	return trackResults
}

func handleArtists(ctx context.Context, recommendations *spotify.Recommendations, mr storage.MediaRepository) <-chan artistResult {
	artistResults := make(chan artistResult)

	go func() {
		defer close(artistResults)
		var wg sync.WaitGroup
		var mu sync.Mutex
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
							artistResults <- artistResult{
								SpotifyID: artist.ID,
								Err:       err,
							}
						} else {
							mu.Lock()
							artists[artist.ID.String()] = struct{}{}
							mu.Unlock()
							artistResults <- artistResult{
								SpotifyID: artist.ID,
								Artist:    *newArtist,
							}
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
