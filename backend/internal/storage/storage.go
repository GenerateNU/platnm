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
	CalculateScore(ctx context.Context, id uuid.UUID) (int, error)
}

type ReviewRepository interface {
	GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error)
	CreateReview(ctx context.Context, review *models.Review) (*models.Review, error)
	UpdateReview(ctx context.Context, update *models.Review) (*models.Review, error)
	GetExistingReview(ctx context.Context, id string) (*models.Review, error)
	ReviewBelongsToUser(ctx context.Context, reviewID string, userID string) (bool, error)
	GetReviewsByID(ctx context.Context, id string, media_type string) ([]*models.Review, error)
}

type MediaRepository interface {
	GetMediaByName(ctx context.Context, name string) ([]models.Media, error)
	GetMediaByDate(ctx context.Context) ([]models.Media, error)
	GetMediaByReviews(ctx context.Context, limit, offset int) ([]models.MediaWithReviewCount, error)
	GetExistingArtistBySpotifyID(ctx context.Context, id string) (*int, error)
	AddArtist(ctx context.Context, artist *models.Artist) (*models.Artist, error)
	GetExistingAlbumBySpotifyID(ctx context.Context, id string) (*int, error)
	AddAlbum(ctx context.Context, artist *models.Album) (*models.Album, error)
	AddAlbumArtist(ctx context.Context, albumId int, artistId int) error
}

type RecommendationRepository interface {
	CreateRecommendation(ctx context.Context, recommendation *models.Recommendation) (*models.Recommendation, error)
}

// Repository storage of all repositories.
type Repository struct {
	User           UserRepository
	Review         ReviewRepository
	Media          MediaRepository
	Recommendation RecommendationRepository
}
