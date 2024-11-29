package schema

import (
	"context"
	"database/sql"
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
	println("inserted into follower table")

	// get the username and profile picture of the followee
	var followeeUsername string
	var followeeProfilePicture string

	// I tried to condesnse this into the insertion but im unsure about syntax,
	// if its possible to do it in one query some help on that would be appreciated!
	err = r.db.QueryRow(ctx, `SELECT username, profile_picture FROM "user" WHERE id = $1`, following).Scan(&followeeUsername, &followeeProfilePicture)
	if err != nil {
		println(err.Error(), "from transactions err ")
		return false, err
	}

	// Add a notificaiton for the followee
	_, err = r.db.Exec(ctx, `
		INSERT INTO notifications (reciever_id, tagged_entity_id, type, tagged_entity_type, thumbnail_url, tagged_entity_name)
		VALUES ($1, $2, 'follow', 'user', $3, $4)
	`, following, follower, followeeProfilePicture, followeeUsername)

	if err != nil {
		println(err.Error(), "from transactions err ")
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
                user_vote urv
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
	if err := r.db.QueryRow(ctx, `INSERT INTO "user" (id, username, display_name, email) VALUES ($1, $2, $3, $4) RETURNING id`, user.ID, user.Username, user.DisplayName, user.Email).Scan(&user.ID); err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (r *UserRepository) UpdateUserBio(ctx context.Context, user uuid.UUID, bio string) error {
	query := `
		UPDATE "user"
		SET bio = $1 
		WHERE id = $2;
	`

	_, err := r.db.Exec(ctx, query, bio, user)

	if err != nil {
		return err
	}

	return nil
}

func (r *UserRepository) UpdateUserProfilePicture(ctx context.Context, user uuid.UUID, pfp string) error {
	query := `
		UPDATE "user"
		SET profile_picture = $1
		WHERE id = $2;
	`

	_, err := r.db.Exec(ctx, query, pfp, user)

	if err != nil {
		return err
	}

	return nil
}

func (r *UserRepository) UpdateUserOnboard(ctx context.Context, email string, enthusiasm string) (string, error) {
	result, err := r.db.Exec(ctx, `UPDATE "user" SET "enthusiasm" = $1 WHERE email = $2`, enthusiasm, email)
	if err != nil {
		return "", err
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return "user not found", nil
	}

	return enthusiasm, nil
}

func (r *UserRepository) GetUserProfile(ctx context.Context, id uuid.UUID) (*models.Profile, error) {
	profile := &models.Profile{}
	query := `SELECT u.id, u.username, u.display_name, COUNT(DISTINCT followers.follower_id) AS follower_count, COUNT(DISTINCT followed.followee_id) AS followed_count, u.bio, u.profile_picture
		FROM "user" u
		LEFT JOIN follower followers ON followers.followee_id = u.id
		LEFT JOIN follower followed ON followed.follower_id = u.id
		WHERE u.id = $1
		GROUP BY u.id, u.username, u.display_name, u.bio, u.profile_picture;`

	err := r.db.QueryRow(ctx, query, id).Scan(&profile.UserID, &profile.Username, &profile.DisplayName, &profile.Followers, &profile.Followed, &profile.Bio, &profile.ProfilePicture)
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

func (r *UserRepository) GetProfileByName(ctx context.Context, name string) ([]*models.Profile, error) {
	query := `SELECT u.id, u.username, u.display_name, profile_picture, bio, COUNT(DISTINCT followers.follower_id) AS follower_count, COUNT(DISTINCT followed.followee_id) AS followed_count
		FROM "user" u
		LEFT JOIN follower followers ON followers.followee_id = u.id
		LEFT JOIN follower followed ON followed.follower_id = u.id
		WHERE username ILIKE '%' || $1 || '%' OR display_name ILIKE '%' || $1 || '%'
		GROUP BY u.id, u.username, u.display_name, u.profile_picture, u.bio
		LIMIT 5;`

	var profiles []*models.Profile

	profileRows, profileErr := r.db.Query(ctx, query, name)
	if profileErr != nil {
		return nil, profileErr
	}
	defer profileRows.Close()

	for profileRows.Next() {
		var profile models.Profile
		if err := profileRows.Scan(
			&profile.UserID,
			&profile.Username,
			&profile.DisplayName,
			&profile.ProfilePicture,
			&profile.Bio,
			&profile.Followers,
			&profile.Followed,
		); err != nil {
			return nil, err
		}

		userUUID, err := uuid.Parse(profile.UserID)
		if err != nil {
			return nil, err
		}
		score, err := r.CalculateScore(ctx, userUUID)
		if err != nil {
			return nil, err
		}
		profile.Score = score
		profiles = append(profiles, &profile)
	}
	return profiles, nil
}

func (r *UserRepository) GetUserFeed(ctx context.Context, id uuid.UUID) ([]*models.Preview, error) {

	exists, err := r.UserExists(ctx, id.String())
	if !exists {
		print("User does not exist.")
		return nil, err
	}

	var previews []*models.Preview
	reviewRepo := NewReviewRepository(r.db)

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
		r.comment,
		r.created_at, 
		r.updated_at,
		COALESCE(a.cover, t.cover) AS media_cover, 
		COALESCE(a.title, t.title) AS media_title, 
		COALESCE(a.artists, t.artists) AS media_artist,
		ARRAY_AGG(tag.name) FILTER (WHERE tag.name IS NOT NULL) AS tags
	FROM review r
	INNER JOIN follower f ON f.followee_id = r.user_id
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
	WHERE f.follower_id = $1
	GROUP BY r.id, r.user_id, u.username, u.display_name, u.profile_picture, r.media_type, r.media_id, r.rating, r.comment, r.created_at, r.updated_at, media_cover, media_title, media_artist
	ORDER BY r.updated_at DESC;`

	// Execute the query
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan results into the feedPosts slice
	for rows.Next() {
		var preview models.Preview
		var comment sql.NullString // Use sql.NullString for nullable strings
		err := rows.Scan(
			&preview.ReviewID,
			&preview.UserID,
			&preview.Username,
			&preview.DisplayName,
			&preview.ProfilePicture,
			&preview.MediaType,
			&preview.MediaID,
			&preview.Rating,
			&comment, // Scan into comment first
			&preview.CreatedAt,
			&preview.UpdatedAt,
			&preview.MediaCover,
			&preview.MediaTitle,
			&preview.MediaArtist,
			&preview.Tags,
		)
		if err != nil {
			return nil, err
		}

		// Assign comment to feedPost.Comment, handling null case
		if comment.Valid {
			preview.Comment = &comment.String // Point to the string if valid
		} else {
			preview.Comment = nil // Set to nil if null
		}

		// Ensure tags is an empty array if null
		if preview.Tags == nil {
			preview.Tags = []string{}
		}

		// Fetch review statistics for the current review
		reviewStat, err := reviewRepo.GetReviewStats(ctx, strconv.Itoa(preview.ReviewID))
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

func (r *UserRepository) CreateSection(ctx context.Context, sectiontype models.SectionType) (models.SectionType, error) {

	if err := r.db.QueryRow(ctx, `INSERT INTO "section_type" (id, title, search_type) VALUES ($1, $2, $3) RETURNING id`, sectiontype.ID, sectiontype.Title, sectiontype.SearchType).Scan(&sectiontype.ID); err != nil {
		return models.SectionType{}, err
	}
	return sectiontype, nil
}

func (r *UserRepository) CreateSectionItem(ctx context.Context, sectionitem models.SectionItem, user string, sectiontype string) (models.SectionItem, error) {
	exists, err := r.UserExists(ctx, user)
	if !exists {
		print("User does not exist.")
		return models.SectionItem{}, err
	}

	if err := r.db.QueryRow(ctx, `INSERT INTO "section_item" (title, cover_photo) VALUES ($1, $2) RETURNING id`, sectionitem.Title, sectionitem.CoverPhoto).Scan(&sectionitem.ID); err != nil {
		return models.SectionItem{}, err
	}

	_, err = r.db.Exec(ctx, `INSERT INTO "section_type_item" (user_id, section_item_id, section_type_id) VALUES ($1, $2, $3)`, user, sectionitem.ID, sectiontype)
	if err != nil {
		return models.SectionItem{}, err
	}

	return sectionitem, nil
}

func (r *UserRepository) UpdateSectionItem(ctx context.Context, sectionitem models.SectionItem) error {
	result, err := r.db.Exec(ctx, `UPDATE "section_item" SET "title" = $1, "cover_photo" = $2 WHERE id = $3`, sectionitem.Title, sectionitem.CoverPhoto, sectionitem.ID)
	if err != nil {
		return err
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return nil
	}

	return nil
}

func (r *UserRepository) DeleteSectionItem(ctx context.Context, section_type_item models.SectionTypeItem) error {

	exists, err := r.UserExists(ctx, section_type_item.UserID)
	if !exists {
		print("User does not exist.")
		return err
	}

	_, err = r.db.Exec(ctx, `DELETE FROM "section_type_item" WHERE section_item_id = $1 AND section_type_id = $2`, section_type_item.SectionItemId, section_type_item.SectionTypeId)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(ctx, `DELETE FROM "section_item" WHERE id = $1`, section_type_item.SectionItemId)
	if err != nil {
		return err
	}

	return nil
}

func (r *UserRepository) DeleteSection(ctx context.Context, section_type_item models.SectionTypeItem) error {

	exists, err := r.UserExists(ctx, section_type_item.UserID)
	if !exists {
		print("User does not exist.")
		return err
	}

	_, err = r.db.Exec(ctx, `DELETE FROM "section_type_item" WHERE section_type_id = $1`, section_type_item.SectionTypeId)
	if err != nil {
		return err
	}

	return nil 
}

func (r *UserRepository) GetUserSections(ctx context.Context, user_id string) ([]models.UserSection, error) {

	rows, err := r.db.Query(ctx,
		`SELECT section_type_item.section_type_id as section_id, section_type.title as section_title, section_type.search_type, section_item.id as item_id, section_item.title as item_title, section_item.cover_photo
		FROM section_type_item
		JOIN section_item on section_item.id = section_type_item.section_item_id
		JOIN section_type on section_type.id = section_type_item.section_type_id
		WHERE section_type_item.user_id = $1
		GROUP by section_type_item.section_type_id, section_type.search_type, section_type.title, section_item.id, section_item.title, section_item.cover_photo`, user_id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	sectionMap := make(map[string]*models.UserSection)

	for rows.Next() {
		var sectionID, sectionTitle, itemID, searchType, itemTitle, coverPhoto string
		if err := rows.Scan(&sectionID, &sectionTitle, &searchType, &itemID, &itemTitle, &coverPhoto); err != nil {
			return nil, err
		}

		section, exists := sectionMap[sectionID]
		if !exists {
			section = &models.UserSection{
				SectionId: func() int {
					id, err := strconv.Atoi(sectionID)
					if err != nil {
						return -1
					}
					return id
				}(),
				Title:      sectionTitle,
				SearchType: searchType,
				Items:      []models.SectionItem{},
			}
			sectionMap[sectionID] = section
		}

		itemIDInt, err := strconv.Atoi(itemID)
		if err != nil {
			return nil, err
		}

		section.Items = append(section.Items, models.SectionItem{
			ID:         itemIDInt,
			Title:      itemTitle,
			CoverPhoto: coverPhoto,
		})
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	var sections []models.UserSection
	for _, section := range sectionMap {
		sections = append(sections, *section)
	}

	return sections, nil
}

func (r *UserRepository) GetUserSectionOptions(ctx context.Context, user_id string) ([]models.SectionOption, error) {
	var options []models.SectionOption
	rows, err := r.db.Query(ctx,
		`SELECT section_type.title, section_type.search_type
		FROM section_type
		WHERE section_type.id NOT IN  
  		  (SELECT section_type_item.section_type_id 
  		  FROM section_type_item
   		  WHERE section_type_item.user_id = $1)`, user_id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var option models.SectionOption
		if err := rows.Scan(&option.SectionTitle, &option.SearchType); err != nil {
			return nil, err
		}
		options = append(options, option)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return options, nil

}

func (r *UserRepository) GetNotifications(ctx context.Context, id string) ([]*models.Notification, error) {
	rows, err := r.db.Query(ctx,`
	   SELECT * FROM notifications 
		 WHERE reciever_id = $1
	`, id)

	if err != nil {
		return nil, err
	}

	var notifications []*models.Notification

	for rows.Next() {
		var notification models.Notification
		if err := rows.Scan(
			&notification.ID, // Scan into notification.ID first
			&notification.Type, // Scan into notification.Type eighth
			&notification.CreatedAt, // Scan into notification.CreatedAt third
			&notification.RecieverID, // Scan into notification.RecieverID fourth
			&notification.TaggedEntityID, // Scan into notification.TaggedEntityID fifth
			&notification.TaggedEntityName, // Scan into notification.TaggedEntityName seventh
			&notification.TaggedEntityType, // Scan into notification.TaggedEntityType sixth
			&notification.Thumbnail, // Scan into notification.Type second
		); err != nil {
			return nil, err
		}
		notifications = append(notifications, &notification)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return notifications, nil

}


func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}
