package schema

import (
	"context"
	"fmt"
	"platnm/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type MediaRepository struct {
	*pgxpool.Pool
}

func (r *MediaRepository) ArtistExists(ctx context.Context, id string) (bool, error) {
	rows, err := r.Query(ctx, `SELECT * FROM "artist" WHERE spotify_id = $1`, id)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	if rows.Next() {
		return true, nil
	}

	return false, nil
}

func (r *MediaRepository) AddArtist(ctx context.Context, artist *models.Artist) (*models.Artist, error) {
	query :=
		`INSERT INTO artist (name, spotify_id, photo, bio)
		VALUES ($1, $2, $3)
		RETURNING id, name;`

	if err := r.QueryRow(ctx, query, "Hozier", "2FXC3k01G6Gw61bmprjgqS", "", "artist").Scan(&artist.ID); err != nil {
		return nil, err
	}

	return artist, nil
}

func (r *MediaRepository) GetMediaByName(ctx context.Context, name string) ([]models.Media, error) {

	// select all rows where either the input string is in the title of the media, or if the string matches one of the titles fuzzily
	var albumQuery = "SELECT * FROM album WHERE levenshtein(title, $1) <= 5 OR title ILIKE '%' || $1 || '%' LIMIT 20;"
	var trackQuery = "SELECT * FROM track WHERE levenshtein(title, $1) <= 5 OR title ILIKE '%' || $1 || '%' LIMIT 20;"

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
			&track.AlbumID,
			&track.Title,
			&track.Duration,
		); err != nil {
			return nil, err
		}
		track.Media = models.TrackMedia
		medias = append(medias, &track)
	}
	fmt.Println(medias)
	return medias, nil
}

func NewMediaRepository(db *pgxpool.Pool) *MediaRepository {
	return &MediaRepository{
		db,
	}
}
