package schema

import (
	"context"
	"database/sql"
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
	userFKeyConstraint          = "review_user_id_fkey"
	uniqueUserMediaConstraint   = "unique_user_media"
	commentUserFKeyConstraint   = "fk_user"
	commentReviewFKeyConstraint = "fk_review"
)

func (r *ReviewRepository) ReviewExists(ctx context.Context, id string) (bool, error) {
	rows, err := r.Query(ctx, `SELECT * FROM review WHERE id = $1`, id)
	if err != nil {
		return false, err
	}
	if rows.Next() {
		return true, nil
	}

	return false, nil
}

// CreateReview creates a new review in the database
// Handles both published and draft reviews
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
	INSERT INTO review (user_id, media_id, media_type, rating, comment, draft)
	SELECT $1, $2, $3::media_type, $4, $5, $6
	FROM media_check
	RETURNING id, created_at, updated_at;
	`

	if err := r.QueryRow(ctx, query, review.UserID, review.MediaID, review.MediaType, review.Rating, review.Comment, review.Draft).Scan(&review.ID, &review.CreatedAt, &review.UpdatedAt); err != nil {
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

func (r *ReviewRepository) CreateComment(ctx context.Context, comment *models.Comment) (*models.Comment, error) {
	query := `
    INSERT INTO comment (text, review_id, user_id, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING id, text, review_id, user_id, created_at;
`

	if err := r.QueryRow(ctx, query, comment.Text, comment.ReviewID, comment.UserID).Scan(
		&comment.ID, &comment.Text, &comment.ReviewID, &comment.UserID, &comment.CreatedAt); err != nil {
		if errs.IsForeignKeyViolation(err, commentUserFKeyConstraint) {
			return nil, errs.NotFound("user", "id", comment.UserID)
		} else if errs.IsForeignKeyViolation(err, commentReviewFKeyConstraint) {
			return nil, errs.NotFound("review", "id", comment.UserID)
		}

		return nil, err
	}

	return comment, nil
}

func (r *ReviewRepository) GetReviewsByUserID(ctx context.Context, id string) ([]*models.Review, error) {

	rows, err := r.Query(ctx, "SELECT * FROM review WHERE user_id = $1 ORDER BY updated_at DESC", id)

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
			&review.Draft,
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

	// Declare these variables first to allow for assignment inside if statement body
	var query string
	var updatedReview models.Review

	query = `
        UPDATE review 
        SET comment = $1, rating = $2, updated_at = now() 
        WHERE id = $3 
        RETURNING id, user_id, comment, rating, updated_at`

	// QueryRow with both rating and comment
	err := r.QueryRow(ctx, query, review.Comment, review.Rating, review.ID).
		Scan(&updatedReview.ID, &updatedReview.UserID, &updatedReview.Comment, &updatedReview.Rating, &updatedReview.UpdatedAt, &review.Draft)

	if err != nil {
		return nil, err
	}

	return &updatedReview, nil
}

func (r *ReviewRepository) GetExistingReview(ctx context.Context, id string) (*models.Review, error) {
	var review models.Review

	row := r.QueryRow(ctx, `
		SELECT id, user_id, media_type, media_id, rating, comment, created_at, updated_at
		FROM review 
		WHERE id = $1`, id)

	// Scan the row into the review object
	err := row.Scan(&review.ID, &review.UserID, &review.MediaType, &review.MediaID, &review.Rating, &review.Comment, &review.CreatedAt, &review.UpdatedAt, &review.Draft)
	if err != nil {
		// If no rows were found, return nil, no error
		if err == sql.ErrNoRows {
			return nil, nil
		}
		// If there is an error, return nil, error
		return nil, err
	}

	// If there are rows and no error, return &review, nil
	return &review, nil
}

func (r *ReviewRepository) ReviewBelongsToUser(ctx context.Context, reviewID string, userID string) (bool, error) {
	rows, err := r.Query(ctx, `SELECT * FROM review WHERE id = $1 and user_id = $2`, reviewID, userID)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	if rows.Next() {
		return true, nil
	}

	return false, nil
}

func (r *ReviewRepository) GetReviewsByID(ctx context.Context, id string, mediaType string) ([]*models.Review, error) {

	rows, err := r.Query(ctx, "SELECT id, user_id, media_id, media_type, rating, comment, created_at, updated_at FROM review WHERE media_id = $1 and media_type = $2 ORDER BY updated_at DESC", id, mediaType)

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
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}

	return reviews, nil
}

func (r *ReviewRepository) GetReviewStats(ctx context.Context, id string) (*models.ReviewStat, error) {
	var reviewStat models.ReviewStat

	row := r.QueryRow(ctx, `SELECT 
    r.id, 
    COALESCE(vote_counts.upvotes, 0) AS upvotes,
    COALESCE(vote_counts.downvotes, 0) AS downvotes,
    COALESCE(comment_counts.comments, 0) AS comments
FROM 
    review r
LEFT JOIN (
    SELECT 
        review_id,
        SUM(CASE WHEN upvote = TRUE THEN 1 ELSE 0 END) AS upvotes,
        SUM(CASE WHEN upvote = FALSE THEN 1 ELSE 0 END) AS downvotes
    FROM 
        user_review_vote
    GROUP BY 
        review_id
) vote_counts ON r.id = vote_counts.review_id
LEFT JOIN (
    SELECT 
        review_id,
        COUNT(id) AS comments
    FROM 
        comment
    GROUP BY 
        review_id
) comment_counts ON r.id = comment_counts.review_id
WHERE 
    r.id = $1;`, id)

	// Scan the row into the review object
	err := row.Scan(&reviewStat.ID, &reviewStat.Upvotes, &reviewStat.Downvotes, &reviewStat.Comments)
	if err != nil {
		// If no rows were found, return nil, no error
		if err == sql.ErrNoRows {
			return nil, nil
		}
		// If there is an error, return nil, error
		return nil, err
	}

	// If there are rows and no error, return &review, nil
	return &reviewStat, nil
}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db,
	}
}
