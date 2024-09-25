
package schema

import (
	"context"
	"errors"
	"fmt"
	"platnm/internal/models"

	"platnm/internal/errs"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type MediaRepository struct {
	*pgxpool.Pool
}

func (r *MediaRepository) GetMediaByName (ctx context.Context, id string) ([]*models.Media, error) {

	// TODO: FINISH UP THIS PART
	
	// rows, err := r.Query(ctx, "SELECT * FROM review WHERE user_id = $1", id)

	// if !rows.Next() {
	// 	return []*models.Review{}, nil
	// }

	// if err != nil {
	// 	return []*models.Review{}, err
	// }

	// defer rows.Close()

	// var reviews []*models.Review
	// for rows.Next() {
	// 	var review models.Review
	// 	if err := rows.Scan(
	// 		&review.ID,
	// 		&review.UserID,
	// 		&review.MediaID,
	// 		&review.MediaType,
	// 		&review.Rating,
	// 		&review.Comment,
	// 		&review.CreatedAt,
	// 		&review.UpdatedAt,
	// 	); err != nil {
	// 		return nil, err
	// 	}
	// 	reviews = append(reviews, &review)
	// }

	// if err := rows.Err(); err != nil {
	// 	return []*models.Review{}, err
	// }

	// return reviews, nil
}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db,
	}
}
