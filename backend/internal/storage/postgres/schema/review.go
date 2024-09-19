package user

import (
	"context"
	"platnm/internal/models"

	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ReviewRepository struct {
	db *pgxpool.Pool
}

func (r *ReviewRepository) GetReviewsByUserID(id string, ctx context.Context) ([]*models.Review, error) {

	rows, err := r.db.Query(context.Background(), "SELECT * FROM review WHERE user_id = $1", id)
	if err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}
	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {

		var review models.Review

		var ID, mediaType, comment *string
		var userID, mediaID, rating *int
		var createdAt, updatedAt *time.Time

		if err := rows.Scan(&review.ID, &userID, &mediaID, &mediaType, &rating, &comment, &createdAt, &updatedAt); err != nil {
			print(err.Error(), "from transactions err ")
			return reviews, err
		}

		review.ID = *ID
		review.UserID = *userID
		review.MediaID = *mediaID
		review.MediaType = *mediaType
		review.Comment = *comment
		review.Rating = *rating
		review.CreatedAt = *createdAt
		review.UpdatedAt = *updatedAt

		reviews = append(reviews, &review)
	}

	if err := rows.Err(); err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}

	return reviews, nil

}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db: db,
	}
}
