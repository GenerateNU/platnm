package user

import (
	"context"
	"platnm/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ReviewRepository struct {
	db *pgxpool.Pool
}

func (r *ReviewRepository) GetReviews(ctx context.Context) ([]*models.Review, error) {
	rows, err := r.db.Query(context.Background(), "SELECT user_id, media_id, media_type, desc, rating, CreatedAt, UpdatedAt FROM review")
	if err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}
	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {
		var review models.Review
		var user_id, media_id, media_type, desc, rating, CreatedAt, UpdatedAt *string

		if err := rows.Scan(&review.UserID, &mediaID, &mediaType, &desc, &rating, &CreatedAt &UpdatedAt); err != nil {
			print(err.Error(), "from transactions err ")
			return review, err
		}

		review.UserID = *userID
		review.MediaID = *mediaID
		review.MediaType = *mediaType
		review.Desc = *desc
		review.Rating = *rating
		review.CreatedAt = * CreatedAt
		review.UpdatedAt = * UpdatedAt

		reviews = append(reviews, &review)
	}

	if err := rows.Err(); err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}

	return reviews, nil
}

func (r *ReviewRepository) GetReviewByID(id string, media_type string, ctx context.Context) (*models.Review, error) {
	var review models.Review
	if (media_type == "album") {
		err := r.db.QueryRow(context.Background(), "SELECT user_id, media_id, media_type, desc, rating, CreatedAt, UpdatedAt FROM review WHERE media_id = $1 and media_type = 'album'", id).Scan(&review.UserID, &mediaID, &mediaType, &desc, &rating, &dateTime)
	} else if (media_type == "track") {
		err := r.db.QueryRow(context.Background(), "SELECT user_id, media_id, media_type, desc, rating, CreatedAt, UpdatedAt FROM review WHERE media_id = $1 and media_type = 'track'", id).Scan(&review.UserID, &mediaID, &mediaType, &desc, &rating, &dateTime)
	}

	if err != nil {
		print(err.Error(), "from transactions err ")
		return nil, err
	}

	return &review, nil
}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db: db,
	}
}