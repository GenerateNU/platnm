package schema

import (
	"context"
	"errors"
	"log"
	"platnm/internal/models"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ReviewRepository struct {
	db *pgxpool.Pool
}

func (r *ReviewRepository) CreateReview(ctx context.Context, review *models.Review) (*models.Review, error) {
	query := `INSERT INTO review (user_id, media_id, media_type, rating, comment) VALUES ($1, $2, $3, $4, $5) ON CONFLICT(user_id, media_id) DO NOTHING RETURNING id`
	if err := r.db.QueryRow(ctx, query, review.UserID, review.MediaID, review.MediaType, review.Rating, review.Comment).Scan(&review.ReviewID); err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok {
			log.Printf("Code: %s\n", pgErr.Code)
			if pgErr.Code == "42P10" {
				return nil, errors.New("review already exists")
			}
		}

		return nil, err
	}

	return review, nil
}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db: db,
	}
}
