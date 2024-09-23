package user

import (
	"context"
	"platnm/internal/models"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"platnm/internal/errs"
)

type ReviewRepository struct {
	db *pgxpool.Pool
}

func (r *ReviewRepository) UserExists(ctx context.Context, id string) (bool, error) {

	rows, err := r.db.Query(ctx, `SELECT * FROM "user" WHERE id = $1`, id)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	if rows.Next() {
		return true, nil
	}

	return false, nil
}

func (r *ReviewRepository) GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error) {

	rows, err := r.db.Query(ctx, "SELECT * FROM review WHERE user_id = $1", id)

	if !rows.Next() {
		return []*models.Review{}, errs.NotFound("Review", "valid user_id", id)
	}

	if err != nil {
		return []*models.Review{}, err
	}

	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {

		var review models.Review

		var mediaType, comment, userID, mediaID, rating *string
		var createdAt, updatedAt *time.Time

		if err := rows.Scan(&review.ID, &userID, &mediaID, &mediaType, &rating, &comment, &createdAt, &updatedAt); err != nil {
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
		return []*models.Review{}, err
	}

	return reviews, nil

}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db: db,
	}
}
