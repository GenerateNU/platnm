package schema

import (
	"context"
	"platnm/internal/models"
	"strconv"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func (r *UserRepository) GetUsers(ctx context.Context) ([]*models.User, error) {
	rows, err := r.db.Query(ctx, `SELECT id, username, display_name, bio, profile_picture, linked_account, created_at, updated_at FROM "user"`)
	if err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.User{}, err
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.ProfilePicture, &user.LinkedAccount, &user.CreatedAt, &user.UpdatedAt); err != nil {
			print(err.Error(), "from transactions err ")
			return []*models.User{}, err
		}
		users = append(users, &user)
	}

	if err := rows.Err(); err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.User{}, err
	}

	return users, nil
}

func (r *UserRepository) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	var user models.User
	err := r.db.QueryRow(ctx, `SELECT id, username, display_name, bio, profile_picture, linked_account, created_at, updated_at FROM "user" WHERE id = $1`, id).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.ProfilePicture, &user.LinkedAccount, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) UserExists(ctx context.Context, id string) (bool, error) {

	rows, err := r.db.Query(ctx, `SELECT * FROM "user" WHERE id = $1`, id)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	if rows.Next() {
		return true, nil
	}

	return false, nil
}

func (r *UserRepository) FollowExists(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error) {

	rows, err := r.db.Query(ctx, `SELECT * FROM follower WHERE follower_id = $1 AND followee_id = $2`, follower, following)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	if rows.Next() {
		return true, nil
	}

	return false, nil
}

func (r *UserRepository) Follow(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error) {

	_, err := r.db.Exec(ctx, `INSERT INTO follower (follower_id, followee_id) VALUES ($1, $2)`, follower, following)
	if err != nil {
		return false, err
	}

	// Match found
	return true, nil
}

func (r *UserRepository) UnFollow(ctx context.Context, follower uuid.UUID, following uuid.UUID) (bool, error) {

	_, err := r.db.Exec(ctx, `DELETE FROM follower WHERE follower_id = $1 AND followee_id = $2`, follower, following)
	if err != nil {
		return false, err
	}

	// Match found
	return true, nil
}

func (r *UserRepository) CalculateScore(ctx context.Context, id uuid.UUID) (int, error) {

	// Coalesce returns first non-null value in the set of arguments, so if SUM returns null, 0 is defaulted to.
	// urv, rec, and u are aliases to user_review_vote, recommendation, and user tables.
	query := `
    SELECT 
        COALESCE((
            SELECT 
                SUM(CASE WHEN urv.upvote = TRUE THEN 1 ELSE -1 END)
            FROM 
                user_review_vote urv
            WHERE 
                urv.user_id = $1
        ), 0) + 
        COALESCE((
            SELECT 
                SUM(CASE WHEN rec.reaction = TRUE THEN 1 ELSE 0 END)
            FROM 
                recommendation rec
            WHERE 
                rec.recommender_id = $1
        ), 0) AS score 
`

	var score int
	err := r.db.QueryRow(ctx, query, id).Scan(&score)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return 0, err
	}

	return score, nil
}

func (r *UserRepository) CreateUser(ctx context.Context, user models.User) (models.User, error) {
	if err := r.db.QueryRow(ctx, `INSERT INTO "user" (username, display_name, email) VALUES ($1, $2, $3) RETURNING id`, user.Username, user.DisplayName, user.Email).Scan(&user.ID); err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (r *UserRepository) GetUserProfile(ctx context.Context, id uuid.UUID) (*models.Profile, error) {
	profile := &models.Profile{}
	query := `SELECT u.id, u.username, u.display_name, u.profile_picture, u.bio, COUNT(DISTINCT followers.follower_id) AS follower_count, COUNT(DISTINCT followed.followee_id) AS followed_count
		FROM "user" u
		LEFT JOIN follower followers ON followers.followee_id = u.id
		LEFT JOIN follower followed ON followed.follower_id = u.id
		WHERE u.id = $1
		GROUP BY u.id, u.username, u.display_name, u.profile_picture, u.bio;`

	exists, err := r.UserExists(ctx, id.String())
	if !exists {
		print("User does not exist.")
		return nil, err
	}

	err = r.db.QueryRow(ctx, query, id).Scan(&profile.UserID, &profile.Username, &profile.DisplayName, &profile.ProfilePicture, &profile.Bio, &profile.Followers, &profile.Followed)
	if err != nil {
		print(err.Error(), "unable to find profile")
		return nil, err
	}

	score, err := r.CalculateScore(ctx, id)
	if err != nil {
		return nil, err
	}
	profile.Score = score

	return profile, nil
}

// func (r *UserRepository) GetUserFeed(ctx context.Context, id uuid.UUID) ([]*models.FeedPost, error) {

// 	exists, err := r.UserExists(ctx, id.String())
// 	if !exists {
// 		print("User does not exist.")
// 		return nil, err
// 	}

// 	var feedPosts []*models.FeedPost

// 	/// SQL query to get reviews and user details from users that the specified user follows
// 	query := `
// 	SELECT
// 	r.id,
// 	r.user_id,
// 	u.username,
// 	r.media_type,
// 	r.media_id,
// 	r.rating,
// 	r.created_at,
// 	r.updated_at,
// 	COALESCE(a.cover, t.cover) AS media_cover,
// 	COALESCE(a.title, t.title) AS media_title,
// 	COALESCE(a.artist, t.artist) AS media_artist,
// 	COALESCE(a.id, t.id) AS media_id
// FROM review r
// INNER JOIN follower f ON f.followee_id = r.user_id
// INNER JOIN "user" u ON u.id = r.user_id
// LEFT JOIN album a ON r.media_type = 'album' AND r.media_id = a.id
// LEFT JOIN track t ON r.media_type = 'track' AND r.media_id = t.id
// WHERE f.follower_id = $1
// ORDER BY r.created_at DESC;`

// 	// Execute the query
// 	rows, err := r.db.Query(ctx, query, id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	// Scan results into the feedPosts slice
// 	for rows.Next() {
// 		var feedPost models.FeedPost
// 		err := rows.Scan(
// 			&feedPost.ID,
// 			&feedPost.UserID,
// 			&feedPost.Username,
// 			&feedPost.MediaType,
// 			&feedPost.MediaID,
// 			&feedPost.Rating,
// 			&feedPost.CreatedAt,
// 			&feedPost.UpdatedAt,
// 			&feedPost.MediaCover,
// 			&feedPost.MediaTitle,
// 			&feedPost.MediaArtist,
// 		)
// 		if err != nil {
// 			return nil, err
// 		}

// 		// Prepare a ReviewRepository instance to call GetReviewStats
// 		reviewRepo := NewReviewRepository(r.db)

// 		// Fetch review statistics for the current review
// 		reviewStat, err := reviewRepo.GetReviewStats(ctx, strconv.Itoa(feedPost.ID))
// 		if err != nil {
// 			return nil, err
// 		}

// 		// If reviewStat is not nil, populate the corresponding fields in FeedPost
// 		if reviewStat != nil {
// 			feedPost.Upvotes = reviewStat.Upvotes
// 			feedPost.Downvotes = reviewStat.Downvotes
// 			feedPost.Comments = reviewStat.Comments
// 		}

// 		// Append the populated FeedPost to the feedPosts slice
// 		feedPosts = append(feedPosts, &feedPost)
// 	}

// 	// Check for errors after looping through rows
// 	if err := rows.Err(); err != nil {
// 		return nil, err
// 	}

// 	return feedPosts, nil
// }

func (r *UserRepository) GetUserFeed(ctx context.Context, id uuid.UUID) ([]*models.FeedPost, error) {

	exists, err := r.UserExists(ctx, id.String())
	if !exists {
		print("User does not exist.")
		return nil, err
	}
	// rows, err := r.db.Query(ctx, "SELECT * FROM follow JOIN User u on followee_id = u.id JOIN Review JOIN user_review_vote WHERE follower_id = $1 ORDER BY updated_at DESC", id);

	// if !rows.Next() {
	// 	return []*models.FeedPost{}, nil
	// }

	// if err != nil {
	// 	return []*models.FeedPost{}, err
	// }

	// defer rows.Close()

	// var feed []*models.FeedPost
	// for rows.Next() {
	// 	var review models.FeedPost
	// 	if err := rows.Scan(
	// 		&review.ID,
	// 		&review.UserID,
	// 		&review.MediaID,
	// 		&review.MediaType,
	// 		&review.Rating,
	// 		&review.Comment,
	// 		&review.CreatedAt,
	// 		&review.UpdatedAt,
	// 		&review.Draft,
	// 	); err != nil {
	// 		return nil, err
	// 	}
	// 	feed = append(reviews, &review)
	// }

	// if err := rows.Err(); err != nil {
	// 	return []*models.FeedPost{}, err
	// }

	// return feed, nil

	var feedPosts []*models.FeedPost

	/// SQL query to get reviews and user details from users that the specified user follows
	query := `
	SELECT 
	r.id, 
	r.user_id, 
	u.username,
	r.media_type, 
	r.media_id, 
	r.rating, 
	r.created_at, 
	r.updated_at, 
	COALESCE(a.cover, t.cover) AS media_cover, 
	COALESCE(a.title, t.title) AS media_title, 
	COALESCE(a.artist, t.artist) AS media_artist,
	COALESCE(a.id, t.id) AS media_id
FROM review r
INNER JOIN follower f ON f.followee_id = r.user_id
INNER JOIN "user" u ON u.id = r.user_id
LEFT JOIN album a ON r.media_type = 'album' AND r.media_id = a.id
LEFT JOIN track t ON r.media_type = 'track' AND r.media_id = t.id
WHERE f.follower_id = $1
ORDER BY r.created_at DESC;`

	// Execute the query
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan results into the feedPosts slice
	for rows.Next() {
		var feedPost models.FeedPost
		err := rows.Scan(
			&feedPost.ID,
			&feedPost.UserID,
			&feedPost.Username,
			&feedPost.MediaType,
			&feedPost.MediaID,
			&feedPost.Rating,
			&feedPost.CreatedAt,
			&feedPost.UpdatedAt,
			&feedPost.MediaCover,
			&feedPost.MediaTitle,
			&feedPost.MediaArtist,
		)
		if err != nil {
			return nil, err
		}

		// Prepare a ReviewRepository instance to call GetReviewStats
		reviewRepo := NewReviewRepository(r.db)

		// Fetch review statistics for the current review
		reviewStat, err := reviewRepo.GetReviewStats(ctx, strconv.Itoa(feedPost.ID))
		if err != nil {
			return nil, err
		}

		// If reviewStat is not nil, populate the corresponding fields in FeedPost
		if reviewStat != nil {
			feedPost.Upvotes = reviewStat.Upvotes
			feedPost.Downvotes = reviewStat.Downvotes
			feedPost.Comments = reviewStat.Comments
		}

		// Append the populated FeedPost to the feedPosts slice
		feedPosts = append(feedPosts, &feedPost)
	}

	// Check for errors after looping through rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return feedPosts, nil

	// var feedPosts []models.FeedPost
	// query := `
	// 	SELECT r.id, r.user_id, r.media_type, r.media_id, r.rating, r.created_at, r.updated_at,
	// 	       r.media_cover, r.media_title, r.media_artist, u.username
	// 	FROM review r
	// 	INNER JOIN follower f ON f.followee_id = r.user_id
	// 	INNER JOIN "user" u ON u.id = r.user_id
	// 	WHERE f.follower_id = $1
	// 	ORDER BY r.created_at DESC
	// 	LIMIT 50;`

	// // Execute the query
	// rows, err := r.db.Query(ctx, query, id)
	// if err != nil {
	// 	return nil, err
	// }
	// defer rows.Close()

	// // Prepare a ReviewRepository instance to call GetReviewStats
	// reviewRepo := NewReviewRepository(r.db) // Assuming you have a function to create a new ReviewRepository

	// // Scan results into the feedPosts slice
	// for rows.Next() {
	// 	var feedPost models.FeedPost
	// 	err := rows.Scan(
	// 		&feedPost.ID,
	// 		&feedPost.UserID,
	// 		&feedPost.MediaType,
	// 		&feedPost.MediaID,
	// 		&feedPost.Rating,
	// 		&feedPost.CreatedAt,
	// 		&feedPost.UpdatedAt,
	// 		&feedPost.MediaCover,
	// 		&feedPost.MediaTitle,
	// 		&feedPost.MediaArtist,
	// 		&feedPost.Username,
	// 	)
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	// Fetch review statistics for the current review
	// 	reviewStat, err := reviewRepo.GetReviewStats(ctx, feedPost.ID) // Pass the review ID
	// 	if err != nil {
	// 		return nil, err // Handle error accordingly
	// 	}

	// 	// Assign the review statistics to the feed post
	// 	feedPost.ReviewStat = reviewStat

	// 	// Append the populated FeedPost to the feedPosts slice
	// 	feedPosts = append(feedPosts, feedPost)
	// }

	// // Check for errors after looping through rows
	// if err := rows.Err(); err != nil {
	// 	return nil, err
	// }

	// return feedPosts, nil
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}
