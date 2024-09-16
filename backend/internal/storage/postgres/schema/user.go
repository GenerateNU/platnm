package user

import (
	"context"
	"platnm/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func (r *UserRepository) GetUsers(ctx context.Context) ([]*models.User, error) {
	rows, err := r.db.Query(context.Background(), "SELECT user_id, first_name, last_name, phone, email, address, profile_picture FROM users")
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

func (r *UserRepository) GetUserByID(id string, ctx context.Context) (*models.User, error) {
	var user models.User
	err := r.db.QueryRow(context.Background(), "SELECT user_id, first_name, last_name, phone, email, profile_picture FROM users WHERE user_id = $1", id).Scan(&user.UserID, &user.FirstName, &user.LastName, &user.Phone, &user.Email, &user.ProfilePicture)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return nil, err
	}

	return &user, nil
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}
