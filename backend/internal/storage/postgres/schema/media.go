package schema

import (
	"context"
	"errors"
	"fmt"
	"platnm/internal/models"
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
		var albumID, priority, trackID, durationSecs int
		var genreID *int
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

		// TODO: fix genre handling, but for now just set it to 0 if null
		var genreIDValue int
		if genreID != nil {
			genreIDValue = *genreID
		} else {
			genreIDValue = 0
		}

		// Switch based on mediaType to append either Album or Track
		switch mediaType {
		case models.AlbumMedia:
			album := &models.Album{
				MediaType:   models.AlbumMedia,
				ID:          albumID,
				Title:       mediaTitle,
				ReleaseDate: releaseDate,
				Cover:       cover,
				Country:     country,
				GenreID:     genreIDValue,
			}
			medias = append(medias, album)
		case models.TrackMedia:
			track := &models.Track{
				MediaType:   models.TrackMedia,
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

func (r *MediaRepository) GetExistingArtistBySpotifyID(ctx context.Context, id string) (*int, error) {
	var artistId int
	err := r.QueryRow(ctx, `SELECT id FROM artist WHERE spotify_id = $1`, id).Scan(&artistId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &artistId, nil
}

func (r *MediaRepository) AddArtist(ctx context.Context, artist *models.Artist) (*models.Artist, error) {
	query :=
		`INSERT INTO artist (name, spotify_id, photo, bio)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id;`

	if err := r.QueryRow(ctx, query, artist.Name, artist.SpotifyID, artist.Photo, artist.Bio).Scan(&artist.ID); err != nil {
		return nil, err
	}

	return artist, nil
}

func (r *MediaRepository) GetExistingAlbumBySpotifyID(ctx context.Context, id string) (*int, error) {
	var albumId int
	fmt.Println("looking for album with spotify id: ", id)
	err := r.QueryRow(ctx, `SELECT id FROM album WHERE spotify_id = $1`, id).Scan(&albumId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &albumId, nil
}

func (r *MediaRepository) AddAlbum(ctx context.Context, album *models.Album) (*models.Album, error) {
	query :=
		`INSERT INTO album (title, release_date, cover, country, spotify_id)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id;`

	if err := r.QueryRow(ctx, query, album.Title, album.ReleaseDate, album.Cover, album.Country, album.SpotifyID).Scan(&album.ID); err != nil {
		return nil, err
	}

	return album, nil
}

func (r *MediaRepository) AddAlbumArtist(ctx context.Context, albumId int, artistId int) error {
	query :=
		`INSERT INTO album_artist (album_id, artist_id)
		 VALUES ($1, $2)`

	result, err := r.Exec(ctx, query, albumId, artistId)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return errors.New("no rows affected")
	}

	return nil
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
		album.MediaType = models.AlbumMedia
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
		track.MediaType = models.TrackMedia
		medias = append(medias, track)
	}
	return medias, nil
}

func (r *MediaRepository) GetMediaByReviews(ctx context.Context, limit, offset int) ([]models.MediaWithReviewCount, error) {
	// store nullable columns as pointers
	// if the column is null, the pointer will be nil
	// fields need to be exported so pgx can access them via reflection
	type columns struct {
		MediaType   string `db:"media_type"`
		ReviewCount int    `db:"review_count"`

		// album columns
		AlbumID     *int       `db:"album_id"`
		AlbumTitle  *string    `db:"album_title"`
		ReleaseDate *time.Time `db:"release_date"`
		Cover       *string    `db:"cover"`
		Country     *string    `db:"country"`
		GenreID     *int       `db:"genre_id"`

		// track columns
		TrackID      *int    `db:"track_id"`
		TrackTitle   *string `db:"track_title"`
		TrackAlbumID *int    `db:"track_album_id"`
		Duration     *int    `db:"duration_seconds"`
	}

	const query string = `
	WITH MostReviewed AS (
		SELECT media_id, media_type, COUNT(*) AS review_count
		FROM review
		GROUP BY media_id, media_type
		ORDER BY review_count DESC
		LIMIT $1 OFFSET $2
	)
	SELECT 
		m.media_type,
		m.review_count,
		a.id AS album_id,
		a.title AS album_title,
		a.release_date,
		a.cover,
		a.country,
		a.genre_id,
		t.id AS track_id,
		t.title AS track_title,
		t.album_id AS track_album_id,
		t.duration_seconds
	FROM MostReviewed m
	LEFT JOIN album a ON m.media_id = a.id AND m.media_type = 'album'
	LEFT JOIN track t ON m.media_id = t.id AND m.media_type = 'track'
	ORDER BY m.review_count DESC;
	`

	rows, err := r.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}

	results, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (models.MediaWithReviewCount, error) {
		c, err := pgx.RowToStructByName[columns](row)
		if err != nil {
			return models.MediaWithReviewCount{}, err
		}

		var media models.Media
		switch c.MediaType {
		case string(models.AlbumMedia):
			album := &models.Album{
				MediaType:   models.AlbumMedia,
				ID:          *c.AlbumID,
				Title:       *c.AlbumTitle,
				ReleaseDate: *c.ReleaseDate,
				Cover:       *c.Cover,
				Country:     *c.Country,
				GenreID:     *c.GenreID,
			}

			media = album
		case string(models.TrackMedia):
			track := &models.Track{
				MediaType: models.TrackMedia,
				ID:        *c.TrackID,
				AlbumID:   *c.TrackAlbumID,
				Title:     *c.TrackTitle,
				Duration:  *c.Duration,
			}

			media = track
		default:
			return models.MediaWithReviewCount{}, fmt.Errorf("unknown media type: %s", c.MediaType)
		}

		return models.MediaWithReviewCount{
			Media: media,
			Count: c.ReviewCount,
		}, nil
	})
	if err != nil {
		return nil, err
	}

	return results, nil
}

func NewMediaRepository(db *pgxpool.Pool) *MediaRepository {
	return &MediaRepository{
		db,
	}
}
