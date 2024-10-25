package schema

import (
	"context"
	"platnm/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PlaylistRepository struct {
	*pgxpool.Pool
}

func (r *PlaylistRepository) CreatePlaylist(ctx context.Context, playlist models.Playlist) error {

	query := `
	INSERT INTO playlist (title, user_id, bio, cover_photo)
	VALUES ($1, $2, $3, $4);
	`

	_, err := r.Exec(ctx, query, playlist.Title, playlist.UserID, playlist.Bio, playlist.CoverPhoto)

	if err != nil {
		return err
	}
	return nil

}

func (r *PlaylistRepository) AddToUserOnQueue(ctx context.Context, id string, track models.Track) error {

	var playlistID string

	findQuery := `SELECT id FROM playlist WHERE user_id = $1 AND title = 'On Queue'`
	err := r.QueryRow(ctx, findQuery, id).Scan(&playlistID)

	if err != nil {
		return err
	}

	// now insert the track into the user's on queue playlist
	insertQuery := `
	INSERT INTO playlist_track (playlist_id, track_id)
	VALUES ($1, $2);
	` 
	_, err = r.Exec(ctx, insertQuery, playlistID, track.ID)

	if err != nil {
		return err
	}
	return nil

}

func NewPlaylistRepository(db *pgxpool.Pool) *PlaylistRepository {
	return &PlaylistRepository{
		db,
	}
}
