package storage

import (
	"context"
	"platnm/internal/models"

	"github.com/google/uuid"
)

type UserRepository interface {
	GetUsers(ctx context.Context) ([]*models.User, error)
	GetUserByID(ctx context.Context, id string) (*models.User, error)
	UserExists(ctx context.Context, id string) (bool, error)
	FollowExists(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error)
	Follow(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error)
	UnFollow(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error)
}

type ReviewRepository interface {
	GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error)
	CreateReview(ctx context.Context, review *models.Review) (*models.Review, error)
}

type MediaRepository interface {
	GetMediaByName(ctx context.Context, name string) ([]*models.Media, error)
}

// Repository storage of all repositories.
type Repository struct {
	User   UserRepository
	Review ReviewRepository
	Media  MediaRepository
}
