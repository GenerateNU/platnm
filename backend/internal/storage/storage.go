package storage

import (
	"context"
	"platnm/internal/models"
)

type UserRepository interface {
	GetUsers(ctx context.Context) ([]*models.User, error)
	GetUserByID(id string, ctx context.Context) (*models.User, error)
}

type ReviewRepository interface {
	GetReviewsByUserID(id string, ctx context.Context) ([]*models.Review, error)
}

// Repository storage of all repositories.
type Repository struct {
	User UserRepository
	Review ReviewRepository
}


