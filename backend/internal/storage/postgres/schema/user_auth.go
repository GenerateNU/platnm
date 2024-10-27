package schema

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserAuthRepository struct {
	*pgxpool.Pool
}

func (r *UserAuthRepository) GetToken(ctx context.Context, id uuid.UUID) (string, error) {
	const query string = `SELECT token FROM user_auth WHERE user_id = $1`

	var token string
	if err := r.QueryRow(ctx, query, id).Scan(&token); err != nil {
		return "", err
	}

	return token, nil
}

func (r *UserAuthRepository) SetToken(ctx context.Context, id uuid.UUID, token string) error {
	const query string = `
	INSERT INTO user_auth (user_id, token)
	VALUES ($1, $2)
	ON CONFLICT ON CONSTRAINT user_auth_user_id_unique
	DO UPDATE SET token = $2 
	`

	if _, err := r.Exec(ctx, query, id, token); err != nil {
		return err
	}

	return nil
}

func NewUserAuthRepository(db *pgxpool.Pool) *UserAuthRepository {
	return &UserAuthRepository{
		db,
	}
}
