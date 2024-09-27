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
	rows, err := r.db.Query(ctx, "SELECT user_id, first_name, last_name, phone, email, address, profile_picture FROM users")
	if err != nil {
		print(err.Error(), "from transactions err ")
		return []*models.User{}, err
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		var user models.User
		var firstName, lastName, phone, email, address, profilePicture *string

		if err := rows.Scan(&user.UserID, &firstName, &lastName, &phone, &email, &address, &profilePicture); err != nil {
			print(err.Error(), "from transactions err ")
			return users, err
		}

		user.FirstName = *firstName
		user.LastName = *lastName
		user.Email = *email
		user.Phone = phone
		user.ProfilePicture = profilePicture

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
	err := r.db.QueryRow(ctx, "SELECT user_id, first_name, last_name, phone, email, profile_picture FROM users WHERE user_id = $1", id).Scan(&user.UserID, &user.FirstName, &user.LastName, &user.Phone, &user.Email, &user.ProfilePicture)

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
		print(err.Error(), "from follow push err ")
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
