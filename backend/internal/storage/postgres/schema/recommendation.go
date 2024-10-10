package schema

import (
	"context"
	"errors"
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	recommenderFKeyConstraint = "user_recommender_fk"
	recommendeeFKeyConstraint = "user_recommendee_fk"
	foreignKeyViolationCode   = "23503" // PostgreSQL error code for foreign key violation
)

type RecommendationRepository struct {
	*pgxpool.Pool
}

func (r *RecommendationRepository) CreateRecommendation(ctx context.Context, recommendation *models.Recommendation) (*models.Recommendation, error) {
	query := `
	WITH media_check AS (
		SELECT 1
		FROM track
		WHERE id = $1 AND $2 = 'track'
		UNION
		SELECT 1
		FROM album
		WHERE id = $1 AND $2 = 'album'
	)
	INSERT INTO recommendation (media_id, media_type, recommendee_id, recommender_id, reaction)
	SELECT $1, $2::media_type, $3, $4, $5
	FROM media_check
	RETURNING id, created_at;
	`

	if err := r.QueryRow(ctx, query, recommendation.MediaID, recommendation.MediaType, recommendation.RecommendeeId, recommendation.RecommenderId, recommendation.Reaction).Scan(&recommendation.ID, &recommendation.CreatedAt); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NotFound(string(recommendation.MediaType), "id", recommendation.MediaID)
		} else if errs.IsForeignKeyViolation(err, recommenderFKeyConstraint) {
			return nil, errs.NotFound("recommender", "id", recommendation.RecommenderId)
		} else if errs.IsForeignKeyViolation(err, recommendeeFKeyConstraint) {
			return nil, errs.NotFound("recommendee", "id", recommendation.RecommendeeId)
		}

		return nil, err
	}

	return recommendation, nil
}

func NewRecommendationRepository(db *pgxpool.Pool) *RecommendationRepository {
	return &RecommendationRepository{
		db,
	}
}