package storage

import (
	"context"
	"platnm/internal/models"
)

type UserRepository interface {
	GetUsers(ctx context.Context) ([]*models.User, error)
	GetUserByID(id string, ctx context.Context) (*models.User, error)
}

type SpotifyRepository interface {
	GetPlatnmPlaylist(ctx context.Context) ([]models.User, error)
}

// Repository storage of all repositories.
type Repository struct {
	User    UserRepository
	Spotify SpotifyRepository
}
