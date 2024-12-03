package media

import (
	"context"
	"fmt"
	"log/slog"
	"platnm/internal/errs"
	"platnm/internal/models"
	"platnm/internal/service/ctxt"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/zmb3/spotify/v2"
)

func (h *Handler) GetMediaByName(c *fiber.Ctx) error {
	name := c.Params("name")
	typeString := c.Query("media_type")

	var mediaType models.MediaType

	switch typeString {
	case "album":
		mediaType = models.AlbumMedia
	case "track":
		mediaType = models.TrackMedia
	case "":
		mediaType = models.BothMedia
	}

	medias, err := h.mediaRepository.GetMediaByName(c.Context(), name, mediaType)
	if err != nil {
		return err
	}

	// If fewer than 5 results, call Spotify API for additional results
	if len(medias) < 5 {
		err = h.searchAndHandleSpotifyMedia(c, name, mediaType)
		if err != nil {
			return err
		}

		medias, err = h.mediaRepository.GetMediaByName(c.Context(), name, mediaType)
		if err != nil {
			return err
		}
	}

	return c.Status(fiber.StatusOK).JSON(medias)
}

func (h *Handler) GetArtistByName(c *fiber.Ctx) error {
	name := c.Params("name")
	artists, err := h.mediaRepository.GetArtistByName(c.Context(), name)
	if err != nil {
		fmt.Println("error", err.Error())
		return err
	}

	if artists == nil {
		artists = []models.Artist{}
	}

	if len(artists) < 5 {
		err = h.searchAndHandleSpotifyArtist(c, name)
		if err != nil {
			return err
		}

		artists, err = h.mediaRepository.GetArtistByName(c.Context(), name)
		if err != nil {
			return err
		}
	}

	return c.Status(fiber.StatusOK).JSON(artists)
}

func (h *Handler) searchAndHandleSpotifyArtist(c *fiber.Ctx, name string) error {
	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	if client == nil {
		return fmt.Errorf("spotify client is nil")
	}

	searchType := spotify.SearchTypeArtist
	result, err := client.Search(c.Context(), name, spotify.SearchType(searchType), spotify.Limit(10))
	if err != nil {
		return err
	}

	if result == nil {
		return fmt.Errorf("spotify search result is nil")
	}

	resp := h.handleSearchResults(client, c.Context(), result)
	return c.Status(fiber.StatusOK).JSON(resp)
}

func (h *Handler) searchAndHandleSpotifyMedia(c *fiber.Ctx, name string, mediaType models.MediaType) error {
	var searchType spotify.SearchType
	switch mediaType {
	case models.AlbumMedia:
		searchType = spotify.SearchTypeAlbum
	case models.TrackMedia:
		searchType = spotify.SearchTypeTrack
	case models.BothMedia:
		searchType = spotify.SearchTypeAlbum | spotify.SearchTypeTrack
	default:
		return errs.InvalidRequestData(map[string]string{"media_type": "invalid media type"})
	}

	client, err := ctxt.GetSpotifyClient(c)
	if err != nil {
		return err
	}

	result, err := client.Search(c.Context(), name, searchType, spotify.Limit(10))

	if err != nil {
		return err
	}

	resp := h.handleSearchResults(client, c.Context(), result)
	return c.Status(fiber.StatusOK).JSON(resp)
}

func (h *Handler) handleSearchResults(client *spotify.Client, ctx context.Context, result *spotify.SearchResult) error {
	var wg sync.WaitGroup
	var errCh = make(chan error, 100)

	if result.Artists != nil && result.Artists.Artists != nil {
		for _, artist := range result.Artists.Artists {
			wg.Add(1)
			go func(artist spotify.FullArtist) {
				defer wg.Done()
				h.handleSearchArtist(ctx, &artist, errCh)
			}(artist)
		}
	}
  

	if (result.Albums) != nil {
		for _, album := range result.Albums.Albums {
			wg.Add(1)
			go func() {
				defer wg.Done()
				albumId, err := h.handleSearchAlbum(ctx, &wg, &album, errCh)
				if err != nil {
					return // error should've been reported in handleSearchAlbum. don't proceed to handleSearchAlbumTracks
				}
				h.handleSearchAlbumTracks(client, ctx, &wg, albumId, album.ID, errCh)
			}()
		}
	}

	if (result.Tracks) != nil {
		for _, track := range result.Tracks.Tracks {
			wg.Add(1)
			go func() {
				defer wg.Done()
				h.handleSearchTrack(ctx, &wg, &track, errCh)
			}()
		}
	}

	wg.Wait()
	close(errCh)

	var allErrs []error
	for err := range errCh {
		allErrs = append(allErrs, err)
	}

	if len(allErrs) > 0 {
		for _, err := range allErrs {
			slog.Warn("error importing recommendation", "error", err)
		}
	}

	return nil
}

func (h *Handler) handleSearchAlbum(ctx context.Context, wg *sync.WaitGroup, album *spotify.SimpleAlbum, errCh chan<- error) (int, error) {
	addedAlbum, err := h.mediaRepository.AddAlbum(ctx, &models.Album{
		MediaType:   models.AlbumMedia,
		SpotifyID:   album.ID.String(),
		Title:       album.Name,
		ReleaseDate: album.ReleaseDateTime(),
		Cover:       album.Images[0].URL,
	})

	if err != nil {
		h.sendError(errCh, "adding album", err)
		return 0, err
	}

	for _, artist := range album.Artists {
		wg.Add(1)
		go func(spotifyArtist spotify.SimpleArtist) {
			defer wg.Done()
			artist := &models.Artist{
				SpotifyID: spotifyArtist.ID.String(),
				Name:      spotifyArtist.Name,
			}

			err := h.mediaRepository.AddArtistAndAlbumArtist(ctx, artist, addedAlbum.ID)
			if err != nil {
				h.sendError(errCh, "adding artist or album artist", err)
			}

		}(artist)
	}

	return addedAlbum.ID, err

}

func (h *Handler) handleSearchAlbumTracks(client *spotify.Client, ctx context.Context, wg *sync.WaitGroup, albumId int, spotifyID spotify.ID, errCh chan<- error) {
	spotifyTracks, err := client.GetAlbumTracks(ctx, spotifyID)
	if err != nil {
		h.sendError(errCh, "getting album tracks from Spotify", err)
		return
	}

	for _, t := range spotifyTracks.Tracks {
		wg.Add(1)
		go func(t spotify.SimpleTrack) {
			defer wg.Done()

			_, err := h.mediaRepository.AddTrack(ctx, &models.Track{
				SpotifyID: t.ID.String(),
				AlbumID:   albumId,
				Title:     t.Name,
				Duration:  int(t.Duration),
			})

			if err != nil {
				h.sendError(errCh, "adding track", err)
			}
		}(t)
	}
}

func (h *Handler) handleSearchTrack(ctx context.Context, wg *sync.WaitGroup, track *spotify.FullTrack, errCh chan<- error) {
	addedAlbum, err := h.mediaRepository.AddAlbum(ctx, &models.Album{
		MediaType:   models.AlbumMedia,
		SpotifyID:   track.Album.ID.String(),
		Title:       track.Album.Name,
		ReleaseDate: track.Album.ReleaseDateTime(),
		Cover:       track.Album.Images[0].URL,
	})
	if err != nil {
		h.sendError(errCh, "adding album", err)
		return
	}

	for _, artist := range track.Album.Artists {
		wg.Add(1)
		go func(artist spotify.SimpleArtist) {
			defer wg.Done()
			err := h.mediaRepository.AddArtistAndAlbumArtist(ctx, &models.Artist{
				SpotifyID: artist.ID.String(),
				Name:      artist.Name,
			}, addedAlbum.ID)
			if err != nil {
				h.sendError(errCh, "adding artist or album artist", err)
			}
		}(artist)
	}

	addedTrack, err := h.mediaRepository.AddTrack(ctx, &models.Track{
		SpotifyID: track.ID.String(),
		AlbumID:   addedAlbum.ID,
		Title:     track.Name,
		Duration:  int(track.Duration / 1000)})

	if err != nil {
		h.sendError(errCh, "adding track", err)
		return
	}

	for _, spotifyArtist := range track.Artists {
		artist := &models.Artist{
			SpotifyID: spotifyArtist.ID.String(),
			Name:      spotifyArtist.Name,
		}
		err = h.mediaRepository.AddArtistAndTrackArtist(ctx, artist, addedTrack.ID)
		if err != nil {
			h.sendError(errCh, "adding artist or track artist", err)
		}
	}
}

func (h *Handler) handleSearchArtist(ctx context.Context, artist *spotify.FullArtist, errCh chan<- error) {
	var photo string
	if len(artist.Images) > 0 {
		photo = artist.Images[0].URL
	} else {
		photo = ""
	}

	modelArtist := &models.Artist{
		SpotifyID: artist.ID.String(),
		Name:      artist.Name,
		Photo:     photo,
		Bio:       "",
	}

	_, err := h.mediaRepository.AddArtist(ctx, modelArtist)
	if err != nil {
		h.sendError(errCh, "adding artist", err)
	}
}

func (h *Handler) sendError(errCh chan<- error, operation string, err error) {
	wrappedErr := fmt.Errorf("error %s: %w", operation, err)
	select {
	case errCh <- wrappedErr:
	default:
	}
}
