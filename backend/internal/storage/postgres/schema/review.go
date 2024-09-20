package user

 import (
 	"context"
 	"platnm/internal/models"

 	"time"

 	"github.com/jackc/pgx/v5/pgxpool"
 )

 type ReviewRepository struct {
 	db *pgxpool.Pool
 }

 func (r *ReviewRepository) GetReviews(ctx context.Context) ([]*models.Review, error) {
	rows, err := r.db.Query(context.Background(), "SELECT user_id, media_id, media_type, desc, rating, CreatedAt, UpdatedAt FROM review")
	if err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}
	defer rows.Close()

	var reviews []*models.Review
	for rows.Next() {
		var review models.Review
		var userID, mediaID, mediaType, desc, rating *string
		var CreatedAt, UpdatedAt *Time.time

		if err := rows.Scan(&userID, &mediaID, &mediaType, &desc, &rating, &UpdatedAt, &CreatedAt); err != nil {
			print(err.Error(), "from transactions err ")
			return reviews, err
		}

		review.UserID = *userID
		review.MediaID = *mediaID
		review.MediaType = *mediaType
		review.Desc = *desc
		review.Rating = *rating
		review.UpdatedAt = *UpdatedAt
		review.CreatedAt = *CreatedAt

		reviews = append(reviews, &review)
	}

	if err := rows.Err(); err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}

	return reviews, nil
}

 func (r *ReviewRepository) GetReviewsByID(ctx context.Context, id string, mediaType string) ([]*models.Review, error) {
	rows, err := r.db.Query(ctx, "SELECT * FROM review WHERE media_id = $1 and MediaType = $2'", id, mediaType)

 	if err != nil {
 		print(err.Error(), "from transactions err ")
 		return []*models.Review{}, err
 	}
 	defer rows.Close()

 	var reviews []*models.Review
 	for rows.Next() {

 		var review models.Review

 		var mediaType, desc, userID, mediaID, rating *string
 		var createdAt, updatedAt *time.Time

 		if err := rows.Scan(&userID, &mediaID, &mediaType, &rating, &desc, &createdAt, &updatedAt); err != nil {
 			print(err.Error(), "from transactions err ")
 			return reviews, err
 		}

 		review.UserID = *userID
 		review.MediaID = *mediaID
 		review.MediaType = *mediaType
 		review.Desc = *desc
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