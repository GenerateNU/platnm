package schema

import (
	"context"
	"fmt"
	"platnm/internal/models"
	"slices"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type MediaRepository struct {
	*pgxpool.Pool
}

func (r *MediaRepository) GetMediaByDate(ctx context.Context) ([]models.Media, error) {
	// Select all media from the database, ordered by release date
	mediaQuery := `SELECT
    album.id AS id,
    album.release_date AS release_date,
    album.cover,
    album.country,
    album.genre_id,
    album.title AS title,         -- Album title
    -1 AS track_id,               -- No track ID for albums
    0 AS duration_seconds,        -- No duration for albums
    album.title AS album_title,   -- Album title for consistency
    'album' AS media_type,
    1 AS media_priority           -- Albums have lower priority
FROM album
UNION
(
    -- Query for tracks
    SELECT
        album.id AS id,
        album.release_date AS release_date,
        album.cover,
        album.country,
        album.genre_id,
        track.title AS title,      -- Track title
        track.id AS track_id,      -- Track ID
        track.duration_seconds,    -- Track duration
        album.title AS album_title, -- Album title for consistency
        'track' AS media_type,
        0 AS media_priority        -- Tracks have higher priority
    FROM track
    JOIN album ON album.id = track.album_id
)
ORDER BY release_date DESC, media_priority ASC
LIMIT 20;`

	mediaRows, mediaErr := r.Query(ctx, mediaQuery)
	if mediaErr != nil {
		return nil, mediaErr
	}
	defer mediaRows.Close()

	var medias []models.Media
	for mediaRows.Next() {
		var mediaTitle, cover, country, mediaTypeStr, albumTitle string
		var albumID, genreID, priority, trackID, durationSecs int
		var releaseDate time.Time

		// Scan the common fields, including mediaType as a string
		if err := mediaRows.Scan(
			&albumID,
			&releaseDate,
			&cover,
			&country,
			&genreID,
			&mediaTitle,
			&trackID,
			&durationSecs,
			&albumTitle,
			&mediaTypeStr,
			&priority,
		); err != nil {
			return nil, err
		}

		// Cast mediaTypeStr into models.MediaType
		mediaType := models.MediaType(mediaTypeStr)

		// Switch based on mediaType to append either Album or Track
		switch mediaType {
		case models.AlbumMedia:
			album := &models.Album{
				ID:          albumID,
				Title:       mediaTitle,
				ReleaseDate: releaseDate,
				Cover:       cover,
				Country:     country,
				GenreID:     genreID,
			}
			medias = append(medias, album)
		case models.TrackMedia:
			track := &models.Track{
				ID:          trackID,
				AlbumID:     albumID,
				Title:       mediaTitle,
				Duration:    durationSecs,
				Cover:       cover,
				ReleaseDate: releaseDate,
				AlbumTitle:  albumTitle,
			}
			medias = append(medias, track)
		default:
			return nil, fmt.Errorf("unknown media type: %s", mediaTypeStr)
		}
	}

	if err := mediaRows.Err(); err != nil {
		return nil, err
	}
	return medias, nil
}

func (r *MediaRepository) GetMediaByName(ctx context.Context, name string) ([]models.Media, error) {
	// Select all rows where either the input string is in the title of the media, or if the string matches one of the titles fuzzily
	var albumQuery = "SELECT * FROM album WHERE levenshtein(title, $1) <= 5 OR title ILIKE '%' || $1 || '%' LIMIT 20;"
	var trackQuery = `
	SELECT 
		track.id AS track_id,
		track.title AS track_title,
		track.duration_seconds,
		track.album_id as album_id,
		album.release_date,
		album.cover,
		album.title as album_title
	FROM track
	JOIN album ON track.album_id = album.id
	WHERE levenshtein(track.title, $1) <= 5 OR track.title ILIKE '%' || $1 || '%'
	LIMIT 20;
	`

	// Execute album query
	albumRows, albumErr := r.Query(ctx, albumQuery, name)
	if albumErr != nil {
		return nil, albumErr
	}
	defer albumRows.Close()

	trackRows, trackErr := r.Query(ctx, trackQuery, name)
	if trackErr != nil {
		return nil, trackErr
	}
	defer trackRows.Close()

	var medias []models.Media
	for albumRows.Next() {
		var album models.Album
		if err := albumRows.Scan(
			&album.ID,
			&album.Title,
			&album.ReleaseDate,
			&album.Cover,
			&album.Country,
			&album.GenreID,
		); err != nil {
			return nil, err
		}
		medias = append(medias, album)
	}

	// Scan track rows
	for trackRows.Next() {
		var track models.Track
		if err := trackRows.Scan(
			&track.ID,
			&track.Title,
			&track.Duration,
			&track.AlbumID,
			&track.ReleaseDate,
			&track.Cover,
			&track.AlbumTitle,
		); err != nil {
			return nil, err
		}
		medias = append(medias, track)
	}
	return medias, nil
}

type albumWithReviewCount struct {
	models.Album
	Count int `db:"review_count"`
}

type trackWithReviewCount struct {
	models.Track
	Count int `db:"review_count"`
}

func (r *MediaRepository) GetMediaByReviews(ctx context.Context, limit, offset int) ([]models.MediaWithReviewCountAndType, error) {
	albumsQuery := `
	WITH MostReviewed AS (
    SELECT media_id, media_type, COUNT(*) AS review_count
    FROM review
    GROUP BY media_id, media_type
    ORDER BY review_count DESC
    LIMIT $1 OFFSET $2
	)
	SELECT m.review_count, a.*
	FROM MostReviewed m
	JOIN album a ON m.media_id = a.id
	WHERE m.media_type = 'album';
	`

	rows, err := r.Query(ctx, albumsQuery, limit, offset)
	if err != nil {
		return nil, err
	}

	albums, err := pgx.CollectRows(rows, pgx.RowToStructByName[albumWithReviewCount])
	if err != nil {
		return nil, err
	}

	tracksQuery := `
	WITH MostReviewed AS (
		SELECT media_id, media_type, COUNT(*) AS review_count
		FROM review
		GROUP BY media_id, media_type
		ORDER BY review_count DESC
		LIMIT $1 OFFSET $2
	)
	SELECT m.review_count, t.*
	FROM MostReviewed m
	JOIN track t ON m.media_id = t.id
	WHERE m.media_type = 'track';
	`

	rows, err = r.Query(ctx, tracksQuery, limit, offset)
	if err != nil {
		return nil, err
	}

	tracks, err := pgx.CollectRows(rows, pgx.RowToStructByName[trackWithReviewCount])
	if err != nil {
		return nil, err
	}

	var media []models.MediaWithReviewCountAndType
	for _, album := range albums {
		media = append(media, models.MediaWithReviewCountAndType{
			Media: album.Album,
			Count: album.Count,
			Type:  models.AlbumMedia,
		})
	}

	for _, track := range tracks {
		media = append(media, models.MediaWithReviewCountAndType{
			Media: track.Track,
			Count: track.Count,
			Type:  models.TrackMedia,
		})
	}

	slices.SortFunc(media, func(a, b models.MediaWithReviewCountAndType) int { return b.Count - a.Count })
	return media, nil
}

func NewMediaRepository(db *pgxpool.Pool) *MediaRepository {
	return &MediaRepository{
		db,
	}
}
