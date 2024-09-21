package schema

import (
	"context"
	"fmt"
	"platnm/internal/models"

	"platnm/internal/errs"

	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ReviewRepository struct {
	*pgxpool.Pool
}

const (
	UserFKeyConstraint = "review_user_id_fkey"
)

func (r *ReviewRepository) CreateReview(ctx context.Context, review *models.Review) (*models.Review, error) {
	query := `
	WITH media_exists AS (
    SELECT CASE
        WHEN $3 = 'track' AND EXISTS (SELECT 1 FROM track WHERE id = $2) THEN true
        WHEN $3 = 'album' AND EXISTS (SELECT 1 FROM album WHERE id = $2) THEN true
        ELSE false
    END AS exists
	)
	INSERT INTO review (user_id, media_id, media_type, rating, comment)
	SELECT $1, $2, $3::media_type, $4, $5
	FROM media_exists
	WHERE exists
	RETURNING id;
	`

	if err := r.QueryRow(ctx, query, review.UserID, review.MediaID, review.MediaType, review.Rating, review.Comment).Scan(&review.ID); err != nil {
		if err == pgx.ErrNoRows {
			return nil, errs.NotFound(string(review.MediaType), "id", review.MediaID)
		} else if pgErr, ok := err.(*pgconn.PgError); ok {
			if pgErr.Code == pgerrcode.UniqueViolation {
				return nil, errs.Conflict("review", "(user_id, media_id)", fmt.Sprintf("(%s, %d)", review.UserID, review.MediaID))
			}
			if pgErr.Code == pgerrcode.ForeignKeyViolation && pgErr.ConstraintName == UserFKeyConstraint {
				return nil, errs.NotFound("user", "id", review.UserID)
			}
		}
		return nil, err
	}

	return review, nil
}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db,
	}
}
