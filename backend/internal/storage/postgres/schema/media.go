package schema

import (
	"context"
	"errors"
	"fmt"
	"net/url"
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

func (r *MediaRepository) GetAlbumById(ctx context.Context, id string) (*models.Album, error) {
	var album models.Album
	err := r.QueryRow(ctx, `SELECT id, title, release_date, cover, spotify_id FROM album WHERE id = $1`, id).Scan(
		&album.ID,
		&album.Title,
		&album.ReleaseDate,
		&album.Cover,
		&album.SpotifyID,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &album, nil
}

func (r *MediaRepository) GetTrackById(ctx context.Context, id string) (*models.Track, error) {
	var track models.Track
	err := r.QueryRow(ctx, `SELECT id, album_id, title, duration_seconds, spotify_id FROM track WHERE id = $1`, id).Scan(
		&track.ID,
		&track.AlbumID,
		&track.Title,
		&track.Duration,
		&track.SpotifyID,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	err = r.QueryRow(ctx, `SELECT cover, title FROM album WHERE id = $1`, track.AlbumID).Scan(
		&track.Cover,
		&track.AlbumTitle,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	track.MediaType = "track"

	return &track, nil
}

func (r *MediaRepository) AddArtist(ctx context.Context, artist *models.Artist) (*models.Artist, error) {
	query :=
		`INSERT INTO artist (name, spotify_id, photo, bio)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (spotify_id) DO NOTHING
		 RETURNING id;`

	var id int
	if err := r.QueryRow(ctx, query, artist.Name, artist.SpotifyID, artist.Photo, artist.Bio).Scan(&id); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			artist.ID = id
			return artist, nil // No new row was inserted because one existed
		}
		return nil, err
	}

	artist.ID = id
	return artist, nil
}

func (r *MediaRepository) GetExistingAlbumBySpotifyID(ctx context.Context, id string) (*int, error) {
	var albumId int
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
		`
		WITH inserted_album AS (
		 INSERT INTO album (title, release_date, cover, spotify_id)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (spotify_id) DO NOTHING
		 RETURNING id
		)
		 SELECT id FROM inserted_album
		 UNION
		 SELECT id FROM album WHERE spotify_id = $4`

	var id int
	if err := r.QueryRow(ctx, query, album.Title, album.ReleaseDate, album.Cover, album.SpotifyID).Scan(&id); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			album.ID = id
			return album, nil // No new row was inserted because one existed
		}
		return nil, err
	}

	album.ID = id
	return album, nil
}

func (r *MediaRepository) AddTrack(ctx context.Context, track *models.Track) (*models.Track, error) {
	query :=
		`
		 INSERT INTO track (album_id, title, duration_seconds, spotify_id)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (spotify_id) DO NOTHING
		 RETURNING id;`

	var id int
	err := r.QueryRow(ctx, query, track.AlbumID, track.Title, track.Duration, track.SpotifyID).Scan(&id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			track.ID = id
			return track, nil // No new row was inserted because one existed
		}
		return nil, err
	}

	track.ID = id
	return track, nil
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

func (r *MediaRepository) AddArtistAndAlbumArtist(ctx context.Context, artist *models.Artist, albumId int) (*models.Artist, error) {
	query := `
		WITH inserted_artist AS (
			INSERT INTO artist (name, spotify_id, photo, bio)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (spotify_id) DO NOTHING
			RETURNING id
		),
		final_artist AS (
			SELECT id FROM inserted_artist
			UNION ALL
			SELECT id FROM artist WHERE spotify_id = $2
			LIMIT 1
		)
		INSERT INTO album_artist (album_id, artist_id)
		SELECT $5, id FROM final_artist
		ON CONFLICT DO NOTHING;`

	var artistId int
	err := r.QueryRow(ctx, query, artist.Name, artist.SpotifyID, artist.Photo, artist.Bio, albumId).Scan(&artistId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	artist.ID = artistId
	return artist, nil
}

func (r *MediaRepository) AddTrackArtist(ctx context.Context, trackId int, artistId int) error {
	query :=
		`INSERT INTO track_artist (track_id, artist_id)
		 VALUES ($1, $2)`
	result, err := r.Exec(ctx, query, trackId, artistId)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return errors.New("no rows affected")
	}

	return nil
}

func (r *MediaRepository) AddArtistAndTrackArtist(ctx context.Context, artist *models.Artist, trackId int) (*models.Artist, error) {
	query := `
		WITH inserted_artist AS (
			INSERT INTO artist (name, spotify_id, photo, bio)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (spotify_id) DO NOTHING
			RETURNING id
		),
		final_artist AS (
			SELECT id FROM inserted_artist
			UNION ALL
			SELECT id FROM artist WHERE spotify_id = $2
			LIMIT 1
		)
		INSERT INTO track_artist (track_id, artist_id)
		SELECT $5, id FROM final_artist
		ON CONFLICT DO NOTHING;`

	var artistId int
	err := r.QueryRow(ctx, query, artist.Name, artist.SpotifyID, artist.Photo, artist.Bio, trackId).Scan(&artistId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	artist.ID = artistId
	return artist, nil
}

func (r *MediaRepository) GetMediaByName(ctx context.Context, name string, mediaType models.MediaType) ([]models.Media, error) {
	// limit, offset int,
	decodedName, err := url.QueryUnescape(name) // handle URL encoding
	if err != nil {
		return nil, fmt.Errorf("failed to decode name: %w", err)
	}

	type columns struct {
		MediaType   string     `db:"media_type"`
		MediaId     int        `db:"media_id"`
		Title       string     `db:"media_title"`
		ArtistName  string     `db:"artist_name"`
		Cover       *string    `db:"cover"`
		ReleaseDate *time.Time `db:"release_date"`
		SpotifyId   *string    `db:"spotify_id"`

		// album column
		AlbumTitle *string `db:"album_title"`

		// track columns
		TrackAlbumID *int `db:"track_album_id"`
		Duration     *int `db:"duration_seconds"`
	}

	const query string = `
			select
			(CASE WHEN t.id IS NOT NULL THEN 'track' ELSE 'album' END) as media_type,
			coalesce(t.id, a.id) as media_id,
			coalesce(t.title, a.title) as media_title,
			coalesce(a.artists, t.artists) as artist_name,
			coalesce(a.cover, t.cover) as cover,
			coalesce(a.release_date, t.release_date) as release_date,
			coalesce(a.spotify_id, t.spotify_id) as spotify_id,
			t.album_id as track_album_id,
			a.title as album_title,
			t.duration_seconds
		from
		(
      select
				a.id,
				a.title,
				a.spotify_id,
				string_agg(ar.name, ', ') as artists,
				cover,
				release_date
			from album a 
				left join album_artist aa on a.id = aa.album_id
				join artist ar on aa.artist_id = ar.id
			group by
				a.id,
				cover,
				a.title,
				a.spotify_id
		) a
    left join (
      select
				t.title,
				t.id,
				string_agg(ar.name, ', ') as artists,
				cover,
				album_id,
				duration_seconds,
				release_date,
				t.spotify_id
			from track t
				left join track_artist ta on t.id = ta.track_id
				join artist ar on ta.artist_id = ar.id
				join album a on t.album_id = a.id
			group by
				t.id,
				cover,
				t.title,
				album_id,
				duration_seconds,
				release_date,
				t.spotify_id
		) t on t.album_id = a.id
		WHERE t.title ILIKE '%' || $1 || '%' OR a.title ILIKE '%' || $1 || '%'
		AND ($2::media_type IS NULL OR 
       		(CASE WHEN t.id IS NOT NULL THEN 'track' ELSE 'album' END)::media_type = $2::media_type)
	`
	var rows pgx.Rows
	if mediaType == models.BothMedia {
		rows, err = r.Query(ctx, query, decodedName, nil)
	} else {
		rows, err = r.Query(ctx, query, decodedName, mediaType)
	}
	if err != nil {
		return nil, err
	}

	results, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (models.Media, error) {
		c, err := pgx.RowToStructByName[columns](row)
		if err != nil {
			return models.Track{}, err
		}

		var media models.Media
		switch c.MediaType {
		case string(models.AlbumMedia):
			album := &models.Album{
				MediaType:   models.AlbumMedia,
				ID:          c.MediaId,
				Title:       c.Title,
				ReleaseDate: *c.ReleaseDate,
				Cover:       *c.Cover,
				ArtistName:  c.ArtistName,
				SpotifyID:   *c.SpotifyId,
			}
			media = album
		case string(models.TrackMedia):
			track := &models.Track{
				MediaType:   models.TrackMedia,
				ID:          c.MediaId,
				Title:       c.Title,
				ReleaseDate: *c.ReleaseDate,
				AlbumID:     *c.TrackAlbumID,
				Duration:    *c.Duration,
				Cover:       *c.Cover,
				ArtistName:  c.ArtistName,
				SpotifyID:   *c.SpotifyId,
			}

			if c.AlbumTitle != nil {
				track.AlbumTitle = *c.AlbumTitle
			}
			media = track
		default:
			return nil, fmt.Errorf("unknown media type: %s", c.MediaType)
		}
		return media, nil
	})

	if err != nil {
		return nil, err
	}

	return results, nil
}

func (r *MediaRepository) GetMediaByReviews(ctx context.Context, limit, offset int, mediaType *string) ([]models.MediaWithReviewCount, error) {
	// store nullable columns as pointers
	// if the column is null, the pointer will be nil
	// fields need to be exported so pgx can access them via reflection
	type columns struct {
		MediaType   string     `db:"media_type"`
		MediaId     int        `db:"media_id"`
		ReviewCount int        `db:"review_count"`
		Title       string     `db:"title"`
		ArtistName  string     `db:"artist_name"`
		Cover       *string    `db:"cover"`
		ReleaseDate *time.Time `db:"release_date"`

		// track columns
		TrackAlbumID *int `db:"track_album_id"`
		Duration     *int `db:"duration_seconds"`
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
				m.media_id,
				m.review_count,
				COALESCE(a.title, t.title) AS title, 
				COALESCE(a.artists, t.artists) AS artist_name,
				COALESCE(a.cover, t.cover) AS cover, 
				COALESCE(a.release_date, t.release_date) AS release_date, 
				t.album_id AS track_album_id,
				t.duration_seconds
			FROM MostReviewed m
		LEFT JOIN (
			SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover, album_id, duration_seconds, release_date
				FROM track t
			LEFT JOIN track_artist ta on t.id = ta.track_id
				JOIN artist ar ON ta.artist_id = ar.id
			JOIN album a on t.album_id = a.id
				GROUP BY t.id, cover, t.title, album_id, duration_seconds, release_date
			) t ON m.media_type = 'track' AND m.media_id = t.id
		LEFT JOIN (
			SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover, release_date
				FROM album a
				LEFT JOIN album_artist aa on a.id = aa.album_id
				JOIN artist ar ON aa.artist_id = ar.id
				GROUP BY a.id, cover, a.title
		) a ON (m.media_type = 'album' AND m.media_id = a.id)
        WHERE ($3::media_type IS NULL OR (m.media_type = $3::media_type))
		ORDER BY m.review_count DESC;
	`
	var rows pgx.Rows
	var err error
	if mediaType == nil || *mediaType == "" {
		rows, err = r.Query(ctx, query, limit, offset, nil)
	} else {
		rows, err = r.Query(ctx, query, limit, offset, *mediaType)
	}
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
				ID:          c.MediaId,
				Title:       c.Title,
				ReleaseDate: *c.ReleaseDate,
				Cover:       *c.Cover,
				ArtistName:  c.ArtistName,
			}
			media = album
		case string(models.TrackMedia):
			track := &models.Track{
				MediaType:   models.TrackMedia,
				ID:          c.MediaId,
				Title:       c.Title,
				ReleaseDate: *c.ReleaseDate,
				AlbumID:     *c.TrackAlbumID,
				Duration:    *c.Duration,
				Cover:       *c.Cover,
				ArtistName:  c.ArtistName,
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
