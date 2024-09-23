package storage

import (
	"context"
	"platnm/internal/models"
)

type UserRepository interface {
	GetUsers(ctx context.Context) ([]*models.User, error)
	GetUserByID(ctx context.Context, id string) (*models.User, error)
	UserExists(ctx context.Context, id string) (bool, error)
}

type ReviewRepository interface {
	GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error)
}

// Repository storage of all repositories.
type Repository struct {
	User UserRepository
	Review ReviewRepository
}


