package schema

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"platnm/internal/constants"
	"platnm/internal/errs"
	"platnm/internal/models"
	"strconv"

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

func (r *ReviewRepository) CommentExists(ctx context.Context, id string) (bool, error) {
	rows, err := r.Query(ctx, `SELECT * FROM comment WHERE id = $1`, id)
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
	INSERT INTO review (user_id, media_id, media_type, rating, title, comment, draft)
	SELECT $1, $2, $3::media_type, $4, $5, $6, $7
	FROM media_check
	RETURNING id, created_at, updated_at;
	`

	if err := r.QueryRow(ctx, query, review.UserID, review.MediaID, review.MediaType, review.Rating, review.Title, review.Comment, review.Draft).Scan(&review.ID, &review.CreatedAt, &review.UpdatedAt); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NotFound(string(review.MediaType), "id", review.MediaID)
		} else if errs.IsUniqueViolation(err, uniqueUserMediaConstraint) {
			return nil, errs.Conflict("review", "(user_id, media_id)", fmt.Sprintf("(%s, %d)", review.UserID, review.MediaID))
		} else if errs.IsForeignKeyViolation(err, userFKeyConstraint) {
			return nil, errs.NotFound("user", "id", review.UserID)
		}

		return nil, err
	}

	// Fetch or create tag IDs and add them to the review_tags table
	for _, label := range review.Tags {
		var tagID int
		tagQuery := `SELECT id FROM tag WHERE name = $1`
		err := r.QueryRow(ctx, tagQuery, label).Scan(&tagID)

		// If the tag doesn't exist, error
		if err == pgx.ErrNoRows {
			return nil, errs.NotFound("tag", "name", label)
		} else if err != nil {
			return nil, err
		}

		// Insert the tag-review relationship into review_tags
		reviewTagQuery := `INSERT INTO review_tag (review_id, tag_id) VALUES ($1, $2)`
		if _, err := r.Exec(ctx, reviewTagQuery, review.ID, tagID); err != nil {
			return nil, err
		}
	}

	_, err := r.Exec(ctx, `UPDATE "user" SET platnm = platnm + $1 WHERE id = $2`, constants.Rating, review.UserID)
	if err != nil {
		return nil, err
	}

	return review, nil
}

func (r *ReviewRepository) GetReviewsByPopularity(ctx context.Context, limit int, offset int) ([]*models.Preview, error) {

	// shoutout to ally for this legendary query, and like 90% of this code
	query := `
	SELECT 
		r.id, 
		r.user_id, 
		u.username,
		u.display_name,
		u.profile_picture,
		r.media_type, 
		r.media_id, 
		r.rating,
		r.title, 
		r.comment,
		r.created_at, 
		r.updated_at,
		COALESCE(a.cover, t.cover) AS media_cover, 
		COALESCE(a.title, t.title) AS media_title, 
		COALESCE(a.artists, t.artists) AS media_artist,
		ARRAY_AGG(tag.name) FILTER (WHERE tag.name IS NOT NULL) AS tags,
		COALESCE(v.vote_count, 0) AS vote_count
	FROM review r
	INNER JOIN "user" u ON u.id = r.user_id
	LEFT JOIN (
		SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM track t
		JOIN track_artist ta on t.id = ta.track_id
		JOIN artist ar ON ta.artist_id = ar.id
		JOIN album a on t.album_id = a.id
		GROUP BY t.id, cover, t.title
	) t ON r.media_type = 'track' AND r.media_id = t.id
	LEFT JOIN (
		SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM album a
		JOIN album_artist aa on a.id = aa.album_id
		JOIN artist ar ON aa.artist_id = ar.id
		GROUP BY a.id, cover, a.title
	) a ON r.media_type = 'album' AND r.media_id = a.id
	LEFT JOIN review_tag rt ON r.id = rt.review_id
	LEFT JOIN tag tag ON rt.tag_id = tag.id
	LEFT JOIN (
		SELECT post_id as review_id, COUNT(*) AS vote_count
		FROM user_vote
		WHERE post_type = 'review'
		GROUP BY post_id
	) v ON r.id = v.review_id
	GROUP BY r.id, r.user_id, u.username, u.display_name, u.profile_picture, r.media_type, r.media_id, r.rating, r.comment, r.created_at, r.updated_at, media_cover, media_title, media_artist, v.vote_count
	ORDER BY vote_count DESC
	LIMIT $1
	OFFSET $2;
	`

	rows, err := r.Query(ctx, query, limit+1, offset) // for some reason this +1 for the limit is needed

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var previews []*models.Preview
	var voteCount int

	// Scan results into the feedPosts slice
	for rows.Next() {
		var preview models.Preview
		var title, comment sql.NullString // Use sql.NullString for nullable strings
		err := rows.Scan(
			&preview.ReviewID,
			&preview.UserID,
			&preview.Username,
			&preview.DisplayName,
			&preview.ProfilePicture,
			&preview.MediaType,
			&preview.MediaID,
			&preview.Rating,
			&title,
			&comment,
			&preview.CreatedAt,
			&preview.UpdatedAt,
			&preview.MediaCover,
			&preview.MediaTitle,
			&preview.MediaArtist,
			&preview.Tags,
			&voteCount,
		)
		if err != nil {
			return nil, err
		}

		// Assign string values if not null
		if comment.Valid {
			preview.Comment = &comment.String // Point to the string if valid
		} else {
			preview.Comment = nil // Set to nil if null
		}

		if title.Valid {
			preview.Title = &title.String // Point to the string if valid
		} else {
			preview.Title = nil // Set to nil if null
		}

		// Ensure tags is an empty array if null
		if preview.Tags == nil {
			preview.Tags = []string{}
		}

		// Fetch review statistics for the current review
		reviewStat, err := r.GetReviewStats(ctx, strconv.Itoa(preview.ReviewID))
		if err != nil {
			return nil, err
		}

		// If reviewStat is not nil, populate the corresponding fields in FeedPost
		if reviewStat != nil {
			preview.ReviewStat = *reviewStat
		}

		// Append the populated FeedPost to the feedPosts slice
		previews = append(previews, &preview)
	}

	// Check for errors after looping through rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return previews, nil

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
		fmt.Println(err)

		return nil, err
	}

	// make a notification for this comment that just got created
	// receiver_id: the person that is receiving the notification, which is the reviewer of comment.ReviewID
	// tagged_entity_id: the comment that was created
	// type: 'create_comment'
	// tagged_entity_type: 'comment'
	// thumbnail_url: cover of the media of the review that received a comment
	// tagged_entity_name: content of the comment

	review, _ := r.GetReviewByID(ctx, strconv.Itoa(comment.ReviewID))

	_, err := r.Exec(ctx, `
		INSERT INTO notifications (receiver_id, tagged_entity_id, type, tagged_entity_type, thumbnail_url, tagged_entity_name)
		VALUES ($1, $2, 'comment', 'comment', $3, $4)
	`, review.UserID, strconv.Itoa(comment.ID), review.MediaCover, comment.Text)

	if err != nil {
		return nil, err
	}

	return comment, nil
}

func (r *ReviewRepository) GetUserReviewsOfMedia(ctx context.Context, media_type string, mediaID string, userID string) ([]*models.Preview, error) {

	// shoutout to ally again <3
	query := `
	SELECT 
		r.id, 
		r.user_id, 
		u.username,
		u.display_name,
		u.profile_picture,
		r.media_type, 
		r.media_id, 
		r.rating,
		r.title, 
		r.comment,
		r.created_at, 
		r.updated_at,
		COALESCE(a.cover, t.cover) AS media_cover, 
		COALESCE(a.title, t.title) AS media_title, 
		COALESCE(a.artists, t.artists) AS media_artist,
		ARRAY_AGG(tag.name) FILTER (WHERE tag.name IS NOT NULL) AS tags
	FROM review r
	INNER JOIN "user" u ON u.id = r.user_id
	LEFT JOIN (
		SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM track t
		JOIN track_artist ta on t.id = ta.track_id
		JOIN artist ar ON ta.artist_id = ar.id
		JOIN album a on t.album_id = a.id
		GROUP BY t.id, cover, t.title
	) t ON r.media_type = 'track' AND r.media_id = t.id
	LEFT JOIN (
		SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM album a
		JOIN album_artist aa on a.id = aa.album_id
		JOIN artist ar ON aa.artist_id = ar.id
		GROUP BY a.id, cover, a.title
	) a ON r.media_type = 'album' AND r.media_id = a.id
	LEFT JOIN review_tag rt ON r.id = rt.review_id
	LEFT JOIN tag tag ON rt.tag_id = tag.id
	LEFT JOIN (
		SELECT post_id as review_id, COUNT(*) AS vote_count
		FROM user_vote
		WHERE post_type = 'review'
		GROUP BY post_id
	) v ON r.id = v.review_id
	WHERE r.user_id = $1 AND r.media_id = $2 AND r.media_type = $3
	GROUP BY r.id, r.user_id, u.username, u.display_name, u.profile_picture, r.media_type, r.media_id, r.rating, r.comment, r.created_at, r.updated_at, media_cover, media_title, media_artist, v.vote_count
	`

	rows, err := r.Query(ctx, query, userID, mediaID, media_type)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	var previews []*models.Preview

	// Scan results into the feedPosts slice
	for rows.Next() {
		var preview models.Preview
		var title, comment sql.NullString // Use sql.NullString for nullable strings
		err := rows.Scan(
			&preview.ReviewID,
			&preview.UserID,
			&preview.Username,
			&preview.DisplayName,
			&preview.ProfilePicture,
			&preview.MediaType,
			&preview.MediaID,
			&preview.Rating,
			&title,
			&comment,
			&preview.CreatedAt,
			&preview.UpdatedAt,
			&preview.MediaCover,
			&preview.MediaTitle,
			&preview.MediaArtist,
			&preview.Tags,
		)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		// Assign comment to feedPost.Comment, handling null case
		if comment.Valid {
			preview.Comment = &comment.String // Point to the string if valid
		} else {
			preview.Comment = nil // Set to nil if null
		}

		if title.Valid {
			preview.Title = &title.String // Point to the string if valid
		} else {
			preview.Title = nil // Set to nil if null
		}

		// Ensure tags is an empty array if null
		if preview.Tags == nil {
			preview.Tags = []string{}
		}

		// Fetch review statistics for the current review
		reviewStat, err := r.GetReviewStats(ctx, strconv.Itoa(preview.ReviewID))
		if err != nil {
			return nil, err
		}

		// If reviewStat is not nil, populate the corresponding fields in FeedPost
		if reviewStat != nil {
			preview.ReviewStat = *reviewStat
		}

		// Append the populated FeedPost to the feedPosts slice
		previews = append(previews, &preview)
	}

	// Check for errors after looping through rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return previews, nil

}

func (r *ReviewRepository) GetUserFollowingReviewsOfMedia(ctx context.Context, media_type string, mediaID string, userID string) ([]*models.Preview, error) {
	query := `
	SELECT 
		r.id, 
		r.user_id, 
		u.username,
		u.display_name,
		u.profile_picture,
		r.media_type, 
		r.media_id, 
		r.rating,
		r.title, 
		r.comment,
		r.created_at, 
		r.updated_at,
		COALESCE(a.cover, t.cover) AS media_cover, 
		COALESCE(a.title, t.title) AS media_title, 
		COALESCE(a.artists, t.artists) AS media_artist,
		ARRAY_AGG(tag.name) FILTER (WHERE tag.name IS NOT NULL) AS tags
	FROM review r
	INNER JOIN "user" u ON u.id = r.user_id
	LEFT JOIN (
		SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM track t
		JOIN track_artist ta on t.id = ta.track_id
		JOIN artist ar ON ta.artist_id = ar.id
		JOIN album a on t.album_id = a.id
		GROUP BY t.id, cover, t.title
	) t ON r.media_type = 'track' AND r.media_id = t.id
	LEFT JOIN (
		SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM album a
		JOIN album_artist aa on a.id = aa.album_id
		JOIN artist ar ON aa.artist_id = ar.id
		GROUP BY a.id, cover, a.title
	) a ON r.media_type = 'album' AND r.media_id = a.id
	LEFT JOIN review_tag rt ON r.id = rt.review_id
	LEFT JOIN tag tag ON rt.tag_id = tag.id
	LEFT JOIN (
		SELECT post_id as review_id, COUNT(*) AS vote_count
		FROM user_vote
		WHERE post_type = 'review'
		GROUP BY post_id
	) v ON r.id = v.review_id
	WHERE r.media_id = $2 AND r.media_type = $3 AND r.user_id IN (
    	SELECT followee_id FROM follower WHERE follower_id = $1
  	)
	GROUP BY r.id, r.user_id, u.username, u.display_name, u.profile_picture, r.media_type, r.media_id, r.rating, r.comment, r.created_at, r.updated_at, media_cover, media_title, media_artist, v.vote_count
	`

	rows, err := r.Query(ctx, query, userID, mediaID, media_type)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	var previews []*models.Preview

	// Scan results into the feedPosts slice
	for rows.Next() {
		var preview models.Preview
		var title, comment sql.NullString // Use sql.NullString for nullable strings
		err := rows.Scan(
			&preview.ReviewID,
			&preview.UserID,
			&preview.Username,
			&preview.DisplayName,
			&preview.ProfilePicture,
			&preview.MediaType,
			&preview.MediaID,
			&preview.Rating,
			&title,
			&comment,
			&preview.CreatedAt,
			&preview.UpdatedAt,
			&preview.MediaCover,
			&preview.MediaTitle,
			&preview.MediaArtist,
			&preview.Tags,
		)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		// Assign comment to feedPost.Comment, handling null case
		if comment.Valid {
			preview.Comment = &comment.String // Point to the string if valid
		} else {
			preview.Comment = nil // Set to nil if null
		}

		if title.Valid {
			preview.Title = &title.String // Point to the string if valid
		} else {
			preview.Title = nil // Set to nil if null
		}

		// Ensure tags is an empty array if null
		if preview.Tags == nil {
			preview.Tags = []string{}
		}

		// Fetch review statistics for the current review
		reviewStat, err := r.GetReviewStats(ctx, strconv.Itoa(preview.ReviewID))
		if err != nil {
			return nil, err
		}

		// If reviewStat is not nil, populate the corresponding fields in FeedPost
		if reviewStat != nil {
			preview.ReviewStat = *reviewStat
		}

		// Append the populated FeedPost to the feedPosts slice
		previews = append(previews, &preview)
	}

	// Check for errors after looping through rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return previews, nil

}

func (r *ReviewRepository) GetReviewsByUserID(ctx context.Context, userId string) ([]*models.Preview, error) {

	query := `
	SELECT 
		r.id, 
		r.user_id, 
		u.username,
		u.display_name,
		u.profile_picture,
		r.media_type, 
		r.media_id, 
		r.rating,
		r.title, 
		r.comment,
		r.created_at, 
		r.updated_at,
		COALESCE(a.cover, t.cover) AS media_cover, 
		COALESCE(a.title, t.title) AS media_title, 
		COALESCE(a.artists, t.artists) AS media_artist,
		ARRAY_AGG(tag.name) FILTER (WHERE tag.name IS NOT NULL) AS tags
	FROM review r
	INNER JOIN "user" u ON u.id = r.user_id
	LEFT JOIN (
		SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM track t
		JOIN track_artist ta on t.id = ta.track_id
		JOIN artist ar ON ta.artist_id = ar.id
		JOIN album a on t.album_id = a.id
		GROUP BY t.id, cover, t.title
	) t ON r.media_type = 'track' AND r.media_id = t.id
	LEFT JOIN (
		SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM album a
		JOIN album_artist aa on a.id = aa.album_id
		JOIN artist ar ON aa.artist_id = ar.id
		GROUP BY a.id, cover, a.title
	) a ON r.media_type = 'album' AND r.media_id = a.id
	LEFT JOIN review_tag rt ON r.id = rt.review_id
	LEFT JOIN tag tag ON rt.tag_id = tag.id
	LEFT JOIN (
		SELECT post_id as review_id, COUNT(*) AS vote_count
		FROM user_vote
		WHERE post_type = 'review'
		GROUP BY post_id
	) v ON r.id = v.review_id
	WHERE r.user_id = $1
	GROUP BY r.id, r.user_id, u.username, u.display_name, u.profile_picture, r.media_type, r.media_id, r.rating, r.comment, r.created_at, r.updated_at, media_cover, media_title, media_artist, v.vote_count
	`

	rows, err := r.Query(ctx, query, userId)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	var previews []*models.Preview

	// Scan results into the feedPosts slice
	for rows.Next() {
		var preview models.Preview
		var title, comment sql.NullString // Use sql.NullString for nullable strings
		err := rows.Scan(
			&preview.ReviewID,
			&preview.UserID,
			&preview.Username,
			&preview.DisplayName,
			&preview.ProfilePicture,
			&preview.MediaType,
			&preview.MediaID,
			&preview.Rating,
			&title,
			&comment,
			&preview.CreatedAt,
			&preview.UpdatedAt,
			&preview.MediaCover,
			&preview.MediaTitle,
			&preview.MediaArtist,
			&preview.Tags,
		)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		// Assign comment to feedPost.Comment, handling null case
		if comment.Valid {
			preview.Comment = &comment.String // Point to the string if valid
		} else {
			preview.Comment = nil // Set to nil if null
		}

		if title.Valid {
			preview.Title = &title.String // Point to the string if valid
		} else {
			preview.Title = nil // Set to nil if null
		}

		// Ensure tags is an empty array if null
		if preview.Tags == nil {
			preview.Tags = []string{}
		}

		// Fetch review statistics for the current review
		reviewStat, err := r.GetReviewStats(ctx, strconv.Itoa(preview.ReviewID))
		if err != nil {
			return nil, err
		}

		// If reviewStat is not nil, populate the corresponding fields in FeedPost
		if reviewStat != nil {
			preview.ReviewStat = *reviewStat
		}

		// Append the populated FeedPost to the feedPosts slice
		previews = append(previews, &preview)
	}

	// Check for errors after looping through rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return previews, nil
}

func (r *ReviewRepository) GetUserReviewOfTrack(ctx context.Context, mediaId string, userId string) (*models.Review, error) {

	row := r.QueryRow(ctx, "SELECT * FROM review WHERE user_id = $1 AND media_id = $2", userId, mediaId)

	var review models.Review
	err := row.Scan(
		&review.ID,
		&review.UserID,
		&review.MediaID,
		&review.MediaType,
		&review.Rating,
		&review.Title,
		&review.Comment,
		&review.CreatedAt,
		&review.UpdatedAt,
		&review.Draft,
	)

	if err == sql.ErrNoRows {
		// Return nil if no review exists for this user and track.
		return nil, nil
	} else if err != nil {
		// Return error if there's a problem with the query.
		return nil, err
	}

	return &review, nil
}

func (r *ReviewRepository) UpdateReview(ctx context.Context, review *models.Review) (*models.Review, error) {

	// Declare these variables first to allow for assignment inside if statement body
	var query string
	var updatedReview models.Review

	query = `
        UPDATE review 
        SET comment = $1, rating = $2, updated_at = now() 
        WHERE id = $3 
        RETURNING id, user_id, comment, rating, updated_at, draft`

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
		SELECT id, user_id, media_type, media_id, rating, title, comment, created_at, updated_at, draft
		FROM review 
		WHERE id = $1`, id)

	// Scan the row into the review object
	err := row.Scan(&review.ID, &review.UserID, &review.MediaType, &review.MediaID, &review.Rating, &review.Title, &review.Comment, &review.CreatedAt, &review.UpdatedAt, &review.Draft)
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

func (r *ReviewRepository) GetReviewsByMediaID(ctx context.Context, id string, mediaType string) ([]*models.Preview, error) {
	query := `
	SELECT 
		r.id, 
		r.user_id, 
		u.username,
		u.display_name,
		u.profile_picture,
		r.media_type, 
		r.media_id, 
		r.rating, 
		r.title,
		r.comment,
		r.created_at, 
		r.updated_at,
		COALESCE(a.cover, t.cover) AS media_cover, 
		COALESCE(a.title, t.title) AS media_title, 
		COALESCE(a.artists, t.artists) AS media_artist,
		ARRAY_AGG(tag.name) FILTER (WHERE tag.name IS NOT NULL) AS tags
	FROM review r
	INNER JOIN "user" u ON u.id = r.user_id
	LEFT JOIN (
		SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM track t
		JOIN track_artist ta on t.id = ta.track_id
		JOIN artist ar ON ta.artist_id = ar.id
		JOIN album a on t.album_id = a.id
		GROUP BY t.id, cover, t.title
	) t ON r.media_type = 'track' AND r.media_id = t.id
	LEFT JOIN (
		SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM album a
		JOIN album_artist aa on a.id = aa.album_id
		JOIN artist ar ON aa.artist_id = ar.id
		GROUP BY a.id, cover, a.title
	) a ON r.media_type = 'album' AND r.media_id = a.id
	LEFT JOIN review_tag rt ON r.id = rt.review_id
	LEFT JOIN tag tag ON rt.tag_id = tag.id
	LEFT JOIN (
		SELECT post_id as review_id, COUNT(*) AS vote_count
		FROM user_vote
		WHERE post_type = 'review'
		GROUP BY post_id
	) v ON r.id = v.review_id
	WHERE r.media_id = $1 AND r.media_type = $2
	GROUP BY r.id, r.user_id, u.username, u.display_name, u.profile_picture, r.media_type, r.media_id, r.rating, r.comment, r.created_at, r.updated_at, media_cover, media_title, media_artist, v.vote_count
	`

	rows, err := r.Query(ctx, query, id, mediaType)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	var previews []*models.Preview

	// Scan results into the feedPosts slice
	for rows.Next() {
		var preview models.Preview
		var title, comment sql.NullString // Use sql.NullString for nullable strings
		err := rows.Scan(
			&preview.ReviewID,
			&preview.UserID,
			&preview.Username,
			&preview.DisplayName,
			&preview.ProfilePicture,
			&preview.MediaType,
			&preview.MediaID,
			&preview.Rating,
			&title,
			&comment,
			&preview.CreatedAt,
			&preview.UpdatedAt,
			&preview.MediaCover,
			&preview.MediaTitle,
			&preview.MediaArtist,
			&preview.Tags,
		)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		// Assign comment to feedPost.Comment, handling null case
		if comment.Valid {
			preview.Comment = &comment.String // Point to the string if valid
		} else {
			preview.Comment = nil // Set to nil if null
		}

		if title.Valid {
			preview.Title = &title.String // Point to the string if valid
		} else {
			preview.Title = nil // Set to nil if null
		}

		// Ensure tags is an empty array if null
		if preview.Tags == nil {
			preview.Tags = []string{}
		}

		// Fetch review statistics for the current review
		reviewStat, err := r.GetReviewStats(ctx, strconv.Itoa(preview.ReviewID))
		if err != nil {
			return nil, err
		}

		// If reviewStat is not nil, populate the corresponding fields in FeedPost
		if reviewStat != nil {
			preview.ReviewStat = *reviewStat
		}

		// Append the populated FeedPost to the feedPosts slice
		previews = append(previews, &preview)
	}

	if err := rows.Err(); err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.Preview{}, err
	}

	return previews, nil
}

func (r *ReviewRepository) GetTags(ctx context.Context) ([]string, error) {
	rows, err := r.Query(ctx, "SELECT name FROM tag")
	if err != nil {
		return nil, err
	}

	var tags []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		tags = append(tags, name)
	}

	return tags, nil
}

// Gets the stats (upvote count, downvote count, and comment count) of a review
func (r *ReviewRepository) GetReviewStats(ctx context.Context, id string) (*models.ReviewStat, error) {
	var reviewStat models.ReviewStat

	row := r.QueryRow(ctx, `SELECT 
    r.id, 
    COALESCE(vote_counts.upvotes, 0) AS upvotes,
    COALESCE(vote_counts.downvotes, 0) AS downvotes,
    COALESCE(comment_counts.comments, 0) AS comments_count
FROM 
    review r
LEFT JOIN (
    SELECT 
        post_id,
        SUM(CASE WHEN upvote = TRUE THEN 1 ELSE 0 END) AS upvotes,
        SUM(CASE WHEN upvote = FALSE THEN 1 ELSE 0 END) AS downvotes
    FROM 
        user_vote
		WHERE post_type = 'review'
    GROUP BY 
        post_id
) vote_counts ON r.id = vote_counts.post_id
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
	err := row.Scan(&reviewStat.ID, &reviewStat.Upvotes, &reviewStat.Downvotes, &reviewStat.CommentCount)
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

func (r *ReviewRepository) GetCommentsByReviewID(ctx context.Context, reviewID string) ([]*models.UserComment, error) {
	rows, err := r.Query(ctx, `
		SELECT c.id, text, review_id, c.user_id, username, display_name, profile_picture, c.created_at, COALESCE(upvotes, 0) AS upvotes, 
    COALESCE(downvotes, 0) AS downvotes
		FROM comment c
		JOIN "user" u ON c.user_id = u.id
		LEFT JOIN (
			SELECT 
					post_id,
					SUM(CASE WHEN upvote = TRUE THEN 1 ELSE 0 END) AS upvotes,
					SUM(CASE WHEN upvote = FALSE THEN 1 ELSE 0 END) AS downvotes
			FROM 
					user_vote
			WHERE post_type = 'comment'
			GROUP BY 
					post_id
	) vote_counts ON c.id = vote_counts.post_id
		WHERE review_id = $1`, reviewID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []*models.UserComment
	for rows.Next() {
		var comment models.UserComment
		if err := rows.Scan(
			&comment.CommentID,
			&comment.Comment,
			&comment.ReviewID,
			&comment.UserID,
			&comment.Username,
			&comment.DisplayName,
			&comment.ProfilePicture,
			&comment.CreatedAt,
			&comment.Upvotes,
			&comment.Downvotes,
		); err != nil {
			return nil, err
		}

		comments = append(comments, &comment)
	}

	return comments, nil
}

func (r *ReviewRepository) GetReviewByID(ctx context.Context, id string) (*models.Preview, error) {

	var preview models.Preview

	query := `
	SELECT 
		r.id, 
		r.user_id, 
		u.username,
		u.display_name,
    u.profile_picture,
		r.media_type, 
		r.media_id, 
		r.rating,
		r.title, 
		r.comment,
		r.created_at, 
		r.updated_at,
		COALESCE(a.cover, t.cover) AS media_cover, 
		COALESCE(a.title, t.title) AS media_title, 
		COALESCE(a.artists, t.artists) AS media_artist,
		ARRAY_AGG(tag.name) FILTER (WHERE tag.name IS NOT NULL) AS tags
	FROM review r
	INNER JOIN "user" u ON u.id = r.user_id
  LEFT JOIN (
    SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM track t
    JOIN track_artist ta on t.id = ta.track_id
		JOIN artist ar ON ta.artist_id = ar.id
    JOIN album a on t.album_id = a.id
		GROUP BY t.id, cover, t.title
    ) t ON r.media_type = 'track' AND r.media_id = t.id
  LEFT JOIN (
    SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM album a
    JOIN album_artist aa on a.id = aa.album_id
		JOIN artist ar ON aa.artist_id = ar.id
		GROUP BY a.id, cover, a.title
  ) a ON r.media_type = 'album' AND r.media_id = a.id
	LEFT JOIN review_tag rt ON r.id = rt.review_id
	LEFT JOIN tag tag ON rt.tag_id = tag.id
	WHERE r.id = $1
	GROUP BY r.id, r.user_id, u.username, u.display_name, u.profile_picture, r.media_type, r.media_id, r.rating, r.comment, r.created_at, r.updated_at, media_cover, media_title, media_artist;`

	var title, comment sql.NullString // Use sql.NullString for nullable strings

	err := r.QueryRow(ctx, query, id).Scan(&preview.ReviewID,
		&preview.UserID,
		&preview.Username,
		&preview.DisplayName,
		&preview.ProfilePicture,
		&preview.MediaType,
		&preview.MediaID,
		&preview.Rating,
		&title,
		&comment,
		&preview.CreatedAt,
		&preview.UpdatedAt,
		&preview.MediaCover,
		&preview.MediaTitle,
		&preview.MediaArtist,
		&preview.Tags)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return nil, err
	}

	// Assign comment to feedPost.Comment, handling null case
	if comment.Valid {
		preview.Comment = &comment.String // Point to the string if valid
	} else {
		preview.Comment = nil // Set to nil if null
	}

	if title.Valid {
		preview.Title = &title.String // Point to the string if valid
	} else {
		preview.Title = nil // Set to nil if null
	}

	// Ensure tags is an empty array if null
	if preview.Tags == nil {
		preview.Tags = []string{}
	}

	// Fetch review statistics for the current review
	reviewStat, err := r.GetReviewStats(ctx, strconv.Itoa(preview.ReviewID))
	if err != nil {
		return nil, err
	}

	// If reviewStat is not nil, populate the corresponding fields in FeedPost
	if reviewStat != nil {
		preview.ReviewStat = *reviewStat
	}

	return &preview, nil
}

func (r *ReviewRepository) UserVote(ctx context.Context, userID string, postID string, upvote bool, postType string) error {

	rows, err := r.Query(ctx, `
		WITH deleted_vote AS (
    -- Delete the existing vote if it exists for the given user, post, and type
    DELETE FROM user_vote
    WHERE user_id = $4
      AND post_id = $1
      AND post_type = $2
    RETURNING *
	),
	post_check AS (
		-- Check if the post exists in the review or comment table
		SELECT id
		FROM review
		WHERE id = $1 AND $2 = 'review'
		UNION ALL
		SELECT id
		FROM comment
		WHERE id = $1 AND $2 = 'comment'
	)
	-- Insert the new vote only if it's a different vote or there was no vote before
	INSERT INTO user_vote (user_id, post_id, post_type, upvote)
	SELECT $4, id, $2, $3
	FROM post_check
	WHERE NOT EXISTS (SELECT 1 FROM deleted_vote) OR $3 <> (SELECT upvote FROM user_vote WHERE user_id = $4 AND post_id = $1 AND post_type = $2 LIMIT 1);

	`, postID, postType, upvote, userID)

	if err != nil {
		return err
	}
	defer rows.Close()

	if err := rows.Err(); err != nil {
		return err
	}

	if postType == "review" {

		// check if the review has more than 10 upvotes and if so notify the person that made the review
		review, _ := r.GetReviewByID(ctx, postID)

		_, err = r.Exec(ctx, `UPDATE "user" SET platnm = platnm + $1 WHERE id = $2`, constants.RecommendationLike, review.UserID)
		if err != nil {
			return err
		}

		if review.ReviewStat.Upvotes >= 10 { // if we have more 10 upvotes on the review now

			_, err = r.Exec(ctx, `
			INSERT INTO notifications (receiver_id, tagged_entity_id, type, tagged_entity_type, thumbnail_url, tagged_entity_name)
			VALUES ($1, $2, 'upvote', 'review', $3, $4)`,
				review.UserID, postID, review.MediaCover, review.Comment)

			if err != nil {
				return err
			}
		}

	} else if postType == "comment" {

		comment, _ := r.GetCommentByCommentID(ctx, postID)

		_, err = r.Exec(ctx, `UPDATE "user" SET platnm = platnm + $1 WHERE id = $2`, constants.PostReaction, comment.UserID)
		if err != nil {
			return err
		}

		if comment.Upvotes >= 10 { // if we have more 10 upvotes on the comment now

			_, err = r.Exec(ctx, `
			INSERT INTO notifications (receiver_id, tagged_entity_id, type, tagged_entity_type, thumbnail_url, tagged_entity_name)
			VALUES ($1, $2, 'upvote', 'comment', $3, $4)`,
				comment.UserID, postID, comment.MediaCover, comment.Comment)

			if err != nil {
				return err
			}

		}

	} else {
		return fmt.Errorf("post type not valid")
	}

	return nil
}

func (r *ReviewRepository) GetCommentByCommentID(ctx context.Context, commentID string) (*models.UserFullComment, error) {
	var comment models.UserFullComment

	query := `
		SELECT c.id, text, review_id, c.user_id, username, display_name, profile_picture, c.created_at, COALESCE(upvotes, 0) AS upvotes, 
	COALESCE(downvotes, 0) AS downvotes, COALESCE(a.cover, t.cover) AS media_cover, 
		COALESCE(a.title, t.title) AS media_title, 
		COALESCE(a.artists, t.artists) AS media_artist
		FROM "comment" c
		JOIN "user" u ON c.user_id = u.id
		LEFT JOIN (
			SELECT 
					post_id,
					SUM(CASE WHEN upvote = TRUE THEN 1 ELSE 0 END) AS upvotes,
					SUM(CASE WHEN upvote = FALSE THEN 1 ELSE 0 END) AS downvotes
			FROM 
					user_vote
			WHERE post_type = 'comment'
			GROUP BY 
					post_id
	) vote_counts ON c.id = vote_counts.post_id
	 LEFT JOIN review r ON c.review_id = r.id
	 LEFT JOIN (
    SELECT t.title, t.id, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM track t
    JOIN track_artist ta on t.id = ta.track_id
		JOIN artist ar ON ta.artist_id = ar.id
    JOIN album a on t.album_id = a.id
		GROUP BY t.id, cover, t.title
    ) t ON r.media_type = 'track' AND r.media_id = t.id
  LEFT JOIN (
    SELECT a.id, a.title, STRING_AGG(ar.name, ', ') AS artists, cover
		FROM album a
    JOIN album_artist aa on a.id = aa.album_id
		JOIN artist ar ON aa.artist_id = ar.id
		GROUP BY a.id, cover, a.title
  ) a ON r.media_type = 'album' AND r.media_id = a.id
	 WHERE c.id = $1`

	err := r.QueryRow(ctx, query, commentID).Scan(&comment.CommentID,
		&comment.Comment,
		&comment.ReviewID,
		&comment.UserID,
		&comment.Username,
		&comment.DisplayName,
		&comment.ProfilePicture,
		&comment.CreatedAt,
		&comment.Upvotes,
		&comment.Downvotes,
		&comment.MediaCover,
		&comment.MediaTitle,
		&comment.MediaArtists)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return nil, err
	}

	return &comment, nil
}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{
		db,
	}
}
