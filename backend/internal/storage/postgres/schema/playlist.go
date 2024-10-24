package schema

import (
	"context"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PlaylistRepository struct {
	*pgxpool.Pool
}

func (r *PlaylistRepository) CreatePlaylist(ctx context.Context, playlist *models.Playlist) error {
	return fiber.ErrBadGateway
}

func NewPlaylistRepository(db *pgxpool.Pool) *PlaylistRepository {
	return &PlaylistRepository{
		db,
	}
}
