package storage

import (
	"context"
	"platnm/internal/models"

	"github.com/google/uuid"
	"github.com/zmb3/spotify/v2"
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
	UpdateUserBio(ctx context.Context, user uuid.UUID, bio string) error
	UpdateUserProfilePicture(ctx context.Context, user uuid.UUID, pfp string) error
	GetUserFeed(ctx context.Context, id uuid.UUID) ([]*models.Preview, error)
	UpdateUserOnboard(ctx context.Context, email string, enthusiasm string) (string, error)
	CreateSection(ctx context.Context, sectiontype models.SectionType) (models.SectionType, error)
	CreateSectionItem(ctx context.Context, sectionitem models.SectionItem, user string, sectiontype string) (models.SectionItem, error)
	UpdateSectionItem(ctx context.Context, sectionitem models.SectionItem) error
	DeleteSectionItem(ctx context.Context, section_type_item models.SectionTypeItem) error
	DeleteSection(ctx context.Context, section_type_item models.SectionTypeItem) error
	GetUserSections(ctx context.Context, id string) ([]models.UserSection, error)
	GetUserSectionOptions(ctx context.Context, id string) ([]models.SectionOption, error)

	GetProfileByName(ctx context.Context, name string) ([]*models.Profile, error)
	GetNotifications(ctx context.Context, id string) ([]*models.Notification, error)
	
	// GetProfileByUser(ctx context.Context, userName string) (*models.Profile, error)
}

type ReviewRepository interface {
	GetUserReviewsOfMedia(ctx context.Context, media_type string, mediaID string, userID string) ([]*models.Preview, error)
	GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error)
	CreateReview(ctx context.Context, review *models.Review) (*models.Review, error)
	ReviewExists(ctx context.Context, id string) (bool, error)
	UpdateReview(ctx context.Context, update *models.Review) (*models.Review, error)
	GetExistingReview(ctx context.Context, id string) (*models.Review, error)
	ReviewBelongsToUser(ctx context.Context, reviewID string, userID string) (bool, error)
	GetReviewsByMediaID(ctx context.Context, id string, media_type string) ([]*models.Review, error)
	CreateComment(ctx context.Context, comment *models.Comment) (*models.Comment, error)
	CommentExists(ctx context.Context, id string) (bool, error)
	GetUserReviewOfTrack(ctx context.Context, id string, id2 string) (*models.Review, error)
	GetTags(ctx context.Context) ([]string, error)
	GetSocialReviews(ctx context.Context, media_type string, mediaID string, userID string) ([]models.FriendReview, int, error)
	GetCommentsByReviewID(ctx context.Context, id string) ([]*models.UserComment, error)
	GetReviewByID(ctx context.Context, id string) (*models.Preview, error)
	GetReviewsByPopularity(ctx context.Context, limit int, offset int) ([]*models.Preview, error)
	UserVote(ctx context.Context, userID string, postID string, vote bool, postType string) error
}

type MediaRepository interface {
	GetMediaByName(ctx context.Context, name string, mediaType models.MediaType) ([]models.Media, error)
	GetMediaByDate(ctx context.Context) ([]models.Media, error)
	GetMediaByReviews(ctx context.Context, limit, offset int, mediaType *string) ([]models.MediaWithReviewCount, error)
	GetTrackById(ctx context.Context, id string) (*models.Track, error)
	GetAlbumById(ctx context.Context, id string) (*models.Album, error)
	GetExistingArtistBySpotifyID(ctx context.Context, id string) (*int, error)
	AddArtist(ctx context.Context, artist *models.Artist) (*models.Artist, error)
	GetExistingAlbumBySpotifyID(ctx context.Context, id string) (*int, error)
	AddAlbum(ctx context.Context, artist *models.Album) (*models.Album, error)
	AddAlbumArtist(ctx context.Context, albumId int, artistId int) error
	AddArtistAndAlbumArtist(ctx context.Context, artist *models.Artist, albumId int) error
	AddTrack(ctx context.Context, track *models.Track) (*models.Track, error)
	AddTrackArtist(ctx context.Context, trackId int, artistId int) error
	GetExistingTrackBySpotifyID(ctx context.Context, id string) (int, error)
	AddArtistAndTrackArtist(ctx context.Context, artist *models.Artist, trackId int) error
	GetArtistsMissingPhoto(ctx context.Context) ([]spotify.ID, error)
	UpdateArtistPhoto(ctx context.Context, spotifyId spotify.ID, photo string) (int, error)
}

type RecommendationRepository interface {
	CreateRecommendation(ctx context.Context, recommendation *models.Recommendation) (*models.Recommendation, error)
	GetRecommendation(ctx context.Context, id string) (*models.Recommendation, error)
	UpdateRecommendation(ctx context.Context, recommendation *models.Recommendation) error
	GetRecommendations(ctx context.Context, id string) ([]*models.Recommendation, error)
}

type VoteRepository interface {
	AddVote(ctx context.Context, vote *models.UserVote, postType string) error
	GetVoteIfExists(ctx context.Context, userID string, reviewID string, postType string) (*models.UserVote, error)
	UpdateVote(ctx context.Context, userID string, reviewID string, vote bool, postType string) error
	DeleteVote(ctx context.Context, userID string, reviewID string, postType string) error
}

type UserAuthRepository interface {
	GetToken(ctx context.Context, id uuid.UUID) (string, error)
	SetToken(ctx context.Context, id uuid.UUID, token string) error
}

type PlaylistRepository interface {
	CreatePlaylist(ctx context.Context, playlist models.Playlist) error
	AddToUserOnQueue(ctx context.Context, id string, track models.Track) error
	GetUserOnQueue(ctx context.Context, id string) ([]*models.OnQueueData, error)
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
