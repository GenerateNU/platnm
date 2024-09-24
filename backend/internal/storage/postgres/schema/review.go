package schema

import (
	"context"
	"errors"
	"fmt"
	"platnm/internal/models"
	"time"

	"platnm/internal/errs"

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
	RETURNING id;
	`

	if err := r.QueryRow(ctx, query, review.UserID, review.MediaID, review.MediaType, review.Rating, review.Comment).Scan(&review.ID); err != nil {
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
		var userID, mediaID, mediaType, desc, rating *string
		var CreatedAt, UpdatedAt *time.Time

		if err := rows.Scan(&userID, &mediaID, &mediaType, &desc, &rating, &UpdatedAt, &CreatedAt); err != nil {
			print(err.Error(), "from transactions err ")
			return reviews, err
		}

		review.UserID = *userID
		review.MediaID = *mediaID
		review.MediaType = *mediaType
		review.Desc = desc
		review.Rating = *rating
		review.UpdatedAt = *UpdatedAt
		review.CreatedAt = *CreatedAt

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
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}

	return reviews, nil
}

func (r *ReviewRepository) GetReviewsByID(ctx context.Context, id string, mediaType string) ([]*models.Review, error) {

	rows, err := r.db.Query(ctx, "SELECT * FROM review WHERE media_id = $1 and Media_type = $2", id, mediaType)
	print(rows)
	if err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}
	defer rows.Close()

	var reviews []*models.Review

	for rows.Next() {
		print("1")
		var review models.Review
		print("2")
		var mediaType, comment, userID, mediaID, rating *string
		var createdAt, updatedAt *time.Time
		print("3")
		if err := rows.Scan(&userID, &mediaID, &mediaType, &rating, &comment, &createdAt, &updatedAt); err != nil {
			print(err.Error(), "from transactions err ")
			return reviews, err
		}
		print("4")
		review.UserID = *userID
		review.MediaID = *mediaID
		review.MediaType = *mediaType
		review.Comment = comment
		review.Rating = *rating
		review.CreatedAt = *createdAt
		review.UpdatedAt = *updatedAt
		print("5")
		reviews = append(reviews, &review)
	}

	print("second")
	if err := rows.Err(); err != nil {
		print(err.Error(), "this from transactions err ")
		return []*models.Review{}, err
	}

	return reviews, nil

}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db: db,
	}
}
