package schema

import (
	"context"
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

func (r *UserRepository) CreateUser(ctx context.Context, username string, displayname string, bio string, profilepicture string, linkedaccount string) error {

	_, err := r.db.Exec(ctx, `INSERT INTO "user" (username, display_name, bio, profile_picture, linked_account) VALUES ($1, $2, $3, $4, $5)`, username, displayname, bio, profilepicture, linkedaccount)
	if err != nil {
		return err
	}

	return nil
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

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}
