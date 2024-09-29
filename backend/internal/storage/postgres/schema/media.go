package schema

import (
	"context"
	"fmt"
	"platnm/internal/models"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type MediaRepository struct {
	*pgxpool.Pool
}

func (r *MediaRepository) GetMediaByDate(ctx context.Context) ([]models.Media, error) {
	// Select all media from the database, ordered by release date
	mediaQuery := `SELECT
			album.id AS id,
			album.title AS title,
			album.release_date AS release_date,
			album.cover,
			album.country,
			album.genre_id,
			-1 AS track_id,
			0 AS duration_seconds,
			'album' AS media_type,
			1 AS media_priority        -- Albums have lower priority 
		FROM album
		UNION
		(
			-- Query for tracks
			SELECT
				album.id AS id,
				track.title AS title,
				album.release_date AS release_date,
				album.cover,
				album.country,
				album.genre_id,
				track.id AS track_id,
				track.duration_seconds,
				'track' AS media_type,
				0 AS media_priority        -- Tracks have higher priority
			FROM track
			JOIN album ON album.id = track.album_id
		)
		ORDER BY release_date DESC, media_priority ASC LIMIT 20;`

	mediaRows, mediaErr := r.Query(ctx, mediaQuery)
	if mediaErr != nil {
		return nil, mediaErr
	}
	defer mediaRows.Close()

	var medias []models.Media
	for mediaRows.Next() {
		var mediaTitle, cover, country, mediaTypeStr string
		var albumID, genreID, priority, trackID, durationSecs int
		var releaseDate time.Time

		// Scan the common fields, including mediaType as a string
		if err := mediaRows.Scan(
			&albumID,
			&mediaTitle,
			&releaseDate,
			&cover,
			&country,
			&genreID,
			&trackID,
			&durationSecs,
			&mediaTypeStr,
			&priority,
		); err != nil {
			fmt.Println(err)
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
				Media:       models.AlbumMedia,
			}
			medias = append(medias, album)
		case models.TrackMedia:
			track := &models.Track{
				ID:          trackID,
				AlbumID:     albumID,
				Title:       mediaTitle,
				Duration:    durationSecs,
				Media:       models.TrackMedia,
				Cover:       cover,
				ReleaseDate: releaseDate,
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
	// select all rows where either the input string is in the title of the media, or if the string matches one of the titles fuzzily
	var albumQuery = "SELECT * FROM album WHERE levenshtein(title, $1) <= 5 OR title ILIKE '%' || $1 || '%' LIMIT 20;"
	var trackQuery = `
	SELECT 
		track.id AS track_id,
		track.title AS track_title,
		track.duration_seconds,
		track.album_id as album_id,
		album.release_date,
		album.cover
	FROM track
	JOIN album ON track.album_id = album.id
	WHERE levenshtein(track.title, $1) <= 5 OR track.title ILIKE '%' || $1 || '%'
	LIMIT 20;
`

	albumRows, albumErr := r.Query(ctx, albumQuery, name)
	trackRows, trackErr := r.Query(ctx, trackQuery, name)

	if albumErr != nil {
		return nil, albumErr
	}
	defer albumRows.Close()

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
		album.Media = models.AlbumMedia
		medias = append(medias, &album)
	}

	for trackRows.Next() {
		var track models.Track
		if err := trackRows.Scan(
			&track.ID,
			&track.Title,
			&track.Duration,
			&track.AlbumID,
			&track.ReleaseDate,
			&track.Cover,
		); err != nil {
			return nil, err
		}
		track.Media = models.TrackMedia
		medias = append(medias, &track)
	}
	return medias, nil
}

func NewMediaRepository(db *pgxpool.Pool) *MediaRepository {
	return &MediaRepository{
		db,
	}
}
