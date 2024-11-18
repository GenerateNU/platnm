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
	Artists      []models.Artist           `json:"artists"`
	Tracks       []models.Track            `json:"tracks"`
	Albums       []models.Album            `json:"albums"`
	TrackArtists []bridgeTrackArtistResult `json:"track_artists"`
	AlbumArtists []bridgeAlbumArtistResult `json:"album_artists"`
}

type bridgeTrackArtistResult struct {
	TrackID  int `json:"track_id"`
	ArtistID int `json:"artist_id"`
}

type bridgeAlbumArtistResult struct {
	AlbumID  int `json:"album_id"`
	ArtistID int `json:"artist_id"`
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

	// use pipeline pattern to insert tracks, albums, artists, and bridge tables concurrently
	stage1 := startPipeline(recommendations)
	stage2, albumResults := handleAlbums(ctx, stage1, errCh, mr)
	stage3, trackResults := handleTracks(ctx, stage2, errCh, mr)
	stage4, artistResults := handleArtists(ctx, stage3, errCh, mr)
	trackArtistResults, albumArtistResults := handleBridge(ctx, stage4, errCh, mr)

	wg.Add(5)

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

	// collect inserted track artists
	go func() {
		defer wg.Done()
		for ta := range trackArtistResults {
			resp.TrackArtists = append(resp.TrackArtists, ta)
		}
	}()

	// collect inserted album artists
	go func() {
		defer wg.Done()
		for aa := range albumArtistResults {
			resp.AlbumArtists = append(resp.AlbumArtists, aa)
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

type handleAlbumsResult struct {
	track   spotify.SimpleTrack
	albumID int
}

func handleAlbums(ctx context.Context, in <-chan spotify.SimpleTrack, errChan chan<- error, mr storage.MediaRepository) (<-chan handleAlbumsResult, <-chan models.Album) {
	var (
		out          = make(chan handleAlbumsResult)
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

		for input := range in {
			mu.Lock()
			id, ok := albums[input.Album.ID.String()]
			mu.Unlock()

			if ok {
				out <- handleAlbumsResult{
					track:   input,
					albumID: id,
				}
			} else {
				if albumId, err := mr.GetExistingAlbumBySpotifyID(ctx, input.Album.ID.String()); err != nil {
					errChan <- err
					continue
				} else {
					if albumId != nil {
						out <- handleAlbumsResult{
							track:   input,
							albumID: *albumId,
						}

						mu.Lock()
						albums[input.Album.ID.String()] = *albumId
						mu.Unlock()
						continue
					}
				}

				var cover string
				if len(input.Album.Images) > 0 {
					cover = input.Album.Images[0].URL
				}

				if album, err := mr.AddAlbum(ctx, &models.Album{
					MediaType:   models.AlbumMedia,
					SpotifyID:   input.Album.ID.String(),
					Title:       input.Album.Name,
					ReleaseDate: input.Album.ReleaseDateTime(),
					Cover:       cover,
				}); err != nil {
					errChan <- err
				} else {
					out <- handleAlbumsResult{
						track:   input,
						albumID: album.ID,
					}
					albumResults <- *album
					mu.Lock()
					albums[input.Album.ID.String()] = album.ID
					mu.Unlock()
				}
			}
		}
	}()
	return out, albumResults
}

type handleTracksResult struct {
	handleAlbumsResult
	trackID int
}

func handleTracks(ctx context.Context, in <-chan handleAlbumsResult, errChan chan<- error, mr storage.MediaRepository) (<-chan handleTracksResult, <-chan models.Track) {
	var (
		out          = make(chan handleTracksResult)
		trackResults = make(chan models.Track)
	)

	go func() {
		defer func() {
			close(out)
			close(trackResults)
		}()

		for input := range in {
			if trackId, err := mr.GetExistingTrackBySpotifyID(ctx, input.track.ID.String()); err != nil {
				errChan <- err
				continue
			} else if trackId != 0 {
				out <- handleTracksResult{
					handleAlbumsResult: input,
					trackID:            trackId,
				}
				continue
			}

			var cover string
			if len(input.track.Album.Images) > 0 {
				cover = input.track.Album.Images[0].URL
			}

			if newTrack, err := mr.AddTrack(ctx, &models.Track{
				MediaType:   models.TrackMedia,
				SpotifyID:   input.track.ID.String(),
				AlbumID:     input.albumID,
				Title:       input.track.Name,
				Duration:    int(input.track.Duration),
				ReleaseDate: input.track.Album.ReleaseDateTime(),
				Cover:       cover,
			}); err != nil {
				errChan <- err
			} else {
				out <- handleTracksResult{
					handleAlbumsResult: input,
					trackID:            newTrack.ID,
				}
				trackResults <- *newTrack
			}
		}
	}()

	return out, trackResults
}

type handleArtistsResult struct {
	trackID  int
	albumID  int
	artistID int
}

func handleArtists(ctx context.Context, in <-chan handleTracksResult, errChan chan<- error, mr storage.MediaRepository) (<-chan handleArtistsResult, <-chan models.Artist) {
	var (
		out           = make(chan handleArtistsResult)
		artistResults = make(chan models.Artist)
	)

	go func() {
		defer func() {
			close(out)
			close(artistResults)
		}()

		var mu sync.Mutex
		// map that stores spotify artist ids that have already been added to the database
		artists := make(map[string]int)

		for input := range in {
			for _, artist := range input.track.Artists {
				mu.Lock()
				id, ok := artists[artist.ID.String()]
				mu.Unlock()

				if ok {
					out <- handleArtistsResult{
						trackID:  input.trackID,
						albumID:  input.albumID,
						artistID: id,
					}
				} else {
					if artistId, err := mr.GetExistingArtistBySpotifyID(ctx, artist.ID.String()); err != nil {
						errChan <- err
						continue
					} else if artistId != nil {
						out <- handleArtistsResult{
							trackID:  input.trackID,
							albumID:  input.albumID,
							artistID: *artistId,
						}
						mu.Lock()
						artists[artist.ID.String()] = *artistId
						mu.Unlock()
						continue
					}

					if newArtist, err := mr.AddArtist(ctx, &models.Artist{
						SpotifyID: artist.ID.String(),
						Name:      artist.Name,
					}); err != nil {
						errChan <- err
					} else {
						out <- handleArtistsResult{
							trackID:  input.trackID,
							albumID:  input.albumID,
							artistID: newArtist.ID,
						}
						artistResults <- *newArtist
						mu.Lock()
						artists[artist.ID.String()] = newArtist.ID
						mu.Unlock()
					}
				}
			}
		}
	}()

	return out, artistResults
}

func handleBridge(ctx context.Context, in <-chan handleArtistsResult, errChan chan<- error, mr storage.MediaRepository) (<-chan bridgeTrackArtistResult, <-chan bridgeAlbumArtistResult) {
	var (
		trackArtistResults = make(chan bridgeTrackArtistResult)
		albumArtistResults = make(chan bridgeAlbumArtistResult)
	)

	go func() {
		defer func() {
			close(trackArtistResults)
			close(albumArtistResults)
		}()

		var (
			muTA         sync.Mutex
			muAA         sync.Mutex
			trackArtists = make(map[bridgeTrackArtistResult]struct{})
			albumArtists = make(map[bridgeAlbumArtistResult]struct{})
			wg           sync.WaitGroup
		)

		for input := range in {
			ta := bridgeTrackArtistResult{
				TrackID:  input.trackID,
				ArtistID: input.artistID,
			}
			muTA.Lock()
			_, ok := trackArtists[ta]
			muTA.Unlock()

			if !ok {
				wg.Add(1)
				go func() {
					defer wg.Done()

					if err := mr.AddTrackArtist(ctx, input.trackID, input.artistID); err != nil {
						errChan <- err
					} else {
						trackArtistResults <- ta
						muTA.Lock()
						trackArtists[ta] = struct{}{}
						muTA.Unlock()
					}
				}()
			}

			aa := bridgeAlbumArtistResult{
				AlbumID:  input.albumID,
				ArtistID: input.artistID,
			}
			muAA.Lock()
			_, ok = albumArtists[aa]
			muAA.Unlock()

			if !ok {
				wg.Add(1)
				go func() {
					defer wg.Done()

					if err := mr.AddAlbumArtist(ctx, input.albumID, input.artistID); err != nil {
						errChan <- err
					} else {
						albumArtistResults <- aa
						muAA.Lock()
						albumArtists[aa] = struct{}{}
						muAA.Unlock()
					}
				}()
			}
		}

		wg.Wait()
	}()

	return trackArtistResults, albumArtistResults
}

func (i *importRecommendationsRequest) toSeeds() spotify.Seeds {
	artistIDs := make([]spotify.ID, len(i.Artists))
	for i, artist := range i.Artists {
		artistIDs[i] = spotify.ID(artist)
	}

	trackIDs := make([]spotify.ID, len(i.Tracks))
	for i, track := range i.Tracks {
		trackIDs[i] = spotify.ID(track)
	}

	return spotify.Seeds{
		Artists: artistIDs,
		Tracks:  trackIDs,
		Genres:  i.Genres,
	}
}
