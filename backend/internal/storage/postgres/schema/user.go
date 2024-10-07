package schema

import (
	"context"
	"platnm/internal/errs"
	"platnm/internal/models"

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
	exists, err := r.UserExists(ctx, id.String())
	if err != nil {
		return 0, err
	}

	if !exists {
		return 0, errs.NotFound("User", "userID", id)
	}

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
                urv.user_id = u.id
        ), 0) + 
        COALESCE((
            SELECT 
                SUM(CASE WHEN rec.reaction = TRUE THEN 1 ELSE 0 END)
            FROM 
                recommendation rec
            WHERE 
                rec.recommender_id = u.id
        ), 0) AS score
    FROM 
        "user" u
    WHERE 
        u.id = $1
`

	var score int
	err = r.db.QueryRow(ctx, query, id).Scan(&score)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return 0, err
	}

	return score, nil
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}
