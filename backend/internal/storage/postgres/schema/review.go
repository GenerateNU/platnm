package user

import (
	"context"
	"platnm/internal/models"

	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"fmt"
)

type ReviewRepository struct {
	db *pgxpool.Pool
}

func (r *ReviewRepository) GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error) {

	rows, err := r.db.Query(ctx, "SELECT * FROM review WHERE user_id = $1", id)

	if !rows.Next() {
		fmt.Println("No rows found, likely an invalid user_id.")
	}

	if err != nil {
		print(err.Error(), "from transactions err ")
		print("id %s is not a valid id ", id)
		return []*models.Review{}, err
	}

	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {

		var review models.Review

		var mediaType, comment, userID, mediaID, rating *string
		var createdAt, updatedAt *time.Time

		if err := rows.Scan(&review.ID, &userID, &mediaID, &mediaType, &rating, &comment, &createdAt, &updatedAt); err != nil {
			print(err.Error(), "from transactions err ")
			return reviews, err
		}

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
