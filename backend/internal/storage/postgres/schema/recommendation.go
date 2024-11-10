package schema

import (
	"context"
	"database/sql"
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

func (r *RecommendationRepository) GetRecommendation(ctx context.Context, id string) (*models.Recommendation, error) {

	var rec models.Recommendation

	row := r.QueryRow(ctx, `SELECT * FROM recommendation WHERE id = $1`, id)

	err := row.Scan(&rec.ID, &rec.MediaType, &rec.MediaID, &rec.RecommenderId, &rec.RecommendeeId, &rec.CreatedAt, &rec.Reaction)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &rec, nil

}

func (r *RecommendationRepository) GetRecommendations(ctx context.Context, id string) ([]*models.Recommendation, error) {
	rows, err := r.Query(ctx, `
	SELECT 
		r.id, 
		r.media_type, 
		r.media_id, 
		COALESCE(a.title, t.title) AS title, 
		COALESCE(a.artists, t.artists) AS artist_name,
		COALESCE(a.cover, t.cover) AS cover, 
		r.recommendee_id, 
		r.recommender_id, 
		r.reaction,
		r.created_at,
		u.username AS recommender_username,
		u.display_name AS recommender_name,
		u.profile_picture AS recommender_picture
	FROM recommendation r
	JOIN "user" u ON r.recommender_id = u.id
	LEFT JOIN (
			SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover, album_id, duration_seconds, release_date
				FROM track t
			LEFT JOIN track_artist ta on t.id = ta.track_id
				JOIN artist ar ON ta.artist_id = ar.id
			JOIN album a on t.album_id = a.id
				GROUP BY t.id, cover, t.title, album_id, duration_seconds, release_date
			) t ON r.media_type = 'track' AND r.media_id = t.id
		LEFT JOIN (
			SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover, release_date
				FROM album a
				LEFT JOIN album_artist aa on a.id = aa.album_id
				JOIN artist ar ON aa.artist_id = ar.id
				GROUP BY a.id, cover, a.title
		) a ON (r.media_type = 'album' AND r.media_id = a.id)
	WHERE recommendee_id = $1`, id)

	if err != nil {
		return []*models.Recommendation{}, err
	}

	defer rows.Close()

	var recs []*models.Recommendation
	for rows.Next() {
		var recommendation models.Recommendation

		if err := rows.Scan(
			&recommendation.ID,
			&recommendation.MediaType,
			&recommendation.MediaID,
			&recommendation.Title,
			&recommendation.ArtistName,
			&recommendation.Cover,
			&recommendation.RecommendeeId,
			&recommendation.RecommenderId,
			&recommendation.Reaction,
			&recommendation.CreatedAt,
			&recommendation.RecommenderUsername,
			&recommendation.RecommenderName,
			&recommendation.RecommenderPicture); err != nil {
			return nil, err
		}
		recs = append(recs, &recommendation)
	}

	if err := rows.Err(); err != nil {
		print(err.Error(), "recommentation Err")
		return []*models.Recommendation{}, err
	}
	return recs, nil
}

func (r *RecommendationRepository) UpdateRecommendation(ctx context.Context, recommendation *models.Recommendation) error {

	query := `
		UPDATE recommendation
		SET reaction = $1
		WHERE id = $2
	`

	_, err := r.Exec(ctx, query, recommendation.Reaction, recommendation.ID)

	if err != nil {
		return err
	}
	return nil

}

func NewRecommendationRepository(db *pgxpool.Pool) *RecommendationRepository {
	return &RecommendationRepository{
		db,
	}
}
