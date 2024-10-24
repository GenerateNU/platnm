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
	VALUES ($1 $2 $3 $4);`

	_, err := r.Exec(ctx, query, playlist.Title, playlist.UserID, playlist.Bio, playlist.CoverPhoto)

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
