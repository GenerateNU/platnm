package schema

import (
	"context"
	"errors"
	"fmt"
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ReviewRepository struct {
	*pgxpool.Pool
}

const (
	userFKeyConstraint        = "review_user_id_fkey"
	uniqueUserMediaConstraint = "unique_user_media"
)

func (r *ReviewRepository) CreateReview(ctx context.Context, review *models.Review) (*models.Review, error) {
	query := `
	WITH media_check AS (
		SELECT 1
		FROM track
		WHERE id = $2 AND $3 = 'track'
		UNION
		SELECT 1
		FROM album
		WHERE id = $2 AND $3 = 'album'
	)
	INSERT INTO review (user_id, media_id, media_type, rating, comment)
	SELECT $1, $2, $3::media_type, $4, $5
	FROM media_check
	RETURNING id, created_at, updated_at;
	`

	if err := r.QueryRow(ctx, query, review.UserID, review.MediaID, review.MediaType, review.Rating, review.Comment).Scan(&review.ID, &review.CreatedAt, &review.UpdatedAt); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NotFound(string(review.MediaType), "id", review.MediaID)
		} else if errs.IsUniqueViolation(err, uniqueUserMediaConstraint) {
			return nil, errs.Conflict("review", "(user_id, media_id)", fmt.Sprintf("(%s, %d)", review.UserID, review.MediaID))
		} else if errs.IsForeignKeyViolation(err, userFKeyConstraint) {
			return nil, errs.NotFound("user", "id", review.UserID)
		}

		return nil, err
	}

	return review, nil
}

func (r *ReviewRepository) GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error) {

	rows, err := r.Query(ctx, "SELECT * FROM review WHERE user_id = $1", id)

	if !rows.Next() {
		return []*models.Review{}, nil
	}

	if err != nil {
		return []*models.Review{}, err
	}

	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {
		var review models.Review
		if err := rows.Scan(
			&review.ID,
			&review.UserID,
			&review.MediaID,
			&review.MediaType,
			&review.Rating,
			&review.Comment,
			&review.CreatedAt,
			&review.UpdatedAt,
		); err != nil {
			return nil, err
		}
		reviews = append(reviews, &review)
	}

	if err := rows.Err(); err != nil {
		return []*models.Review{}, err
	}

	return reviews, nil
}

func (r *ReviewRepository) UpdateReview(ctx context.Context, review *models.Review) (*models.Review, error) {
	query := `
        UPDATE reviews 
        SET comment = $1, rating = $2, updatedAt = $3 
        WHERE id = $4 
        RETURNING id, user_id, comment, rating, updatedAt`

	var updatedReview models.Review

	// Using QueryRowContext to execute the update and get the updated review
	err := r.QueryRow(ctx, query, review.Comment, review.Rating, review.UpdatedAt, review.ID).
		Scan(&updatedReview.ID, &updatedReview.UserID, &updatedReview.Comment, &updatedReview.Rating, &updatedReview.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &updatedReview, nil
}

func (r *ReviewRepository) ReviewExists(ctx context.Context, id string) (bool, error) {

	rows, err := r.Query(ctx, `SELECT * FROM review WHERE id = $1`, id)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	if rows.Next() {
		return true, nil
	}

	return false, nil
}

func (r *ReviewRepository) ReviewBelongsToUser(ctx context.Context, reviewID string, userID string) (bool, error) {
	//println("userid: " + userID)
	//println("reviewid: " + reviewID)
	rows, err := r.Query(ctx, `SELECT * FROM review WHERE "id" = $1, user_id = $2`, reviewID, userID)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	if rows.Next() {
		return true, nil
	}

	return false, nil
}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db,
	}
}
