package storage

import (
	"context"
	"platnm/internal/models"

	"github.com/google/uuid"
)

type UserRepository interface {
	GetUsers(ctx context.Context) ([]*models.User, error)
	GetUserByID(ctx context.Context, id string) (*models.User, error)
	GetUserProfile(ctx context.Context, id uuid.UUID) (*models.Profile, error)
	UserExists(ctx context.Context, id string) (bool, error)
	FollowExists(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error)
	Follow(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error)
	UnFollow(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error)
	CalculateScore(ctx context.Context, id uuid.UUID) (int, error)
	CreateUser(ctx context.Context, user models.User) (models.User, error)
	GetUserFeed(ctx context.Context, id uuid.UUID) ([]*models.FeedPost, error)
}

type ReviewRepository interface {
	GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error)
	CreateReview(ctx context.Context, review *models.Review) (*models.Review, error)
	ReviewExists(ctx context.Context, id string) (bool, error)
	UpdateReview(ctx context.Context, update *models.Review) (*models.Review, error)
	GetExistingReview(ctx context.Context, id string) (*models.Review, error)
	ReviewBelongsToUser(ctx context.Context, reviewID string, userID string) (bool, error)
	GetReviewsByID(ctx context.Context, id string, media_type string) ([]*models.Review, error)
	CreateComment(ctx context.Context, comment *models.Comment) (*models.Comment, error)
	GetUserReviewOfTrack(ctx context.Context, id string, id2 string) (*models.Review, error)
	GetTags(ctx context.Context) ([]string, error)
}

type MediaRepository interface {
	GetMediaByName(ctx context.Context, name string, mediaType models.MediaType) ([]models.Media, error)
	GetMediaByDate(ctx context.Context) ([]models.Media, error)
	GetMediaByReviews(ctx context.Context, limit, offset int, mediaType *string) ([]models.MediaWithReviewCount, error)
	GetExistingArtistBySpotifyID(ctx context.Context, id string) (*int, error)
	AddArtist(ctx context.Context, artist *models.Artist) (*models.Artist, error)
	GetExistingAlbumBySpotifyID(ctx context.Context, id string) (*int, error)
	AddAlbum(ctx context.Context, artist *models.Album) (*models.Album, error)
	AddAlbumArtist(ctx context.Context, albumId int, artistId int) error
	AddTrack(ctx context.Context, track *models.Track) (*models.Track, error)
	AddTrackArtist(ctx context.Context, trackId int, artistId int) error
}

type RecommendationRepository interface {
	CreateRecommendation(ctx context.Context, recommendation *models.Recommendation) (*models.Recommendation, error)
	GetRecommendation(ctx context.Context, id string) (*models.Recommendation, error)
	UpdateRecommendation(ctx context.Context, recommendation *models.Recommendation) error
	GetRecommendations(ctx context.Context, id string) ([]*models.Recommendation, error)
}

type VoteRepository interface {
	AddVote(ctx context.Context, vote *models.UserReviewVote) error
	GetVoteIfExists(ctx context.Context, userID string, reviewID string) (*models.UserReviewVote, error)
	UpdateVote(ctx context.Context, userID string, reviewID string, vote bool) error
	DeleteVote(ctx context.Context, userID string, reviewID string) error
}

type UserAuthRepository interface {
	GetToken(ctx context.Context, id uuid.UUID) (string, error)
	SetToken(ctx context.Context, id uuid.UUID, token string) error
}

type PlaylistRepository interface {
	CreatePlaylist(ctx context.Context, playlist models.Playlist) error
	AddToUserOnQueue(ctx context.Context, id string, track models.Track) error
}

// Repository storage of all repositories.
type Repository struct {
	User           UserRepository
	Review         ReviewRepository
	UserReviewVote VoteRepository
	Media          MediaRepository
	Recommendation RecommendationRepository
	UserAuth       UserAuthRepository
	Playlist       PlaylistRepository
}
