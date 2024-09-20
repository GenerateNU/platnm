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
		var userId, mediaId, mediaType, desc, rating, CreatedAt, UpdatedAt *string

		if err := rows.Scan(&review.UserID, &mediaID, &mediaType, &desc, &rating, &CreatedAt &UpdatedAt); err != nil {
			print(err.Error(), "from transactions err ")
			return review, err
		}

		review.UserID = *userID
		review.MediaID = *mediaID
		review.MediaType = *mediaType
		review.Desc = desc
		review.Rating = *rating
		review.CreatedAt = *CreatedAt
		review.UpdatedAt = *UpdatedAt

		reviews = append(reviews, &review)
	}

	if err := rows.Err(); err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Review{}, err
	}

	return reviews, nil
}

 func (r *ReviewRepository) GetReviewsByID(ctx context.Context, id string) ([]*models.Review, error) {

	if (media_type == "album") {
		rows, err := r.db.Query(ctx, "SELECT * FROM review WHERE media_id = $1 and media_type = 'album'", id)
	} else if (media_type == "track") {
		rows, err := r.db.Query(ctx, "SELECT * FROM review WHERE media_id = $1 and media_type = 'track'", id)
	}
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

 		if err := rows.Scan(&review.reviewID, &userID, &mediaID, &mediaType, &rating, &desc, &createdAt, &updatedAt); err != nil {
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