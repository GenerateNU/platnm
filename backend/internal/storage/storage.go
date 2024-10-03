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
	CreateReview(ctx context.Context, review *models.Review) (*models.Review, error)
	//Not sure if I should've created this in the review repo
	ReviewExists(ctx context.Context, id string) (bool, error)
}

type VoteRepository interface {
	AddVote(ctx context.Context, vote *models.UserReviewVote) (error)
	GetVoteIfExists(ctx context.Context, userID string, reviewID string) (*models.UserReviewVote, error)
	UpdateVote(ctx context.Context, userID string, reviewID string, vote bool) (error)
	DeleteVote(ctx context.Context, userID string, reviewID string) (error)
}
// Repository storage of all repositories.
type Repository struct {
	User   UserRepository
	Review ReviewRepository
	UserReviewVote VoteRepository
}


