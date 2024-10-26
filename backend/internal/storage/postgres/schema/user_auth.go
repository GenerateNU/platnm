package schema

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/oauth2"
)

type UserAuthRepository struct {
	*pgxpool.Pool
}

func (r *UserAuthRepository) GetToken(ctx context.Context, id uuid.UUID) (oauth2.Token, error) {
	const query string = `
	SELECT access_token, token_type, refresh_token, expiry
	FROM user_auth
	WHERE user_id = $1
	`

	var token oauth2.Token
	if err := r.QueryRow(ctx, query, id).Scan(&token.AccessToken, &token.TokenType, &token.RefreshToken, &token.Expiry); err != nil {
		return oauth2.Token{}, err
	}

	return token, nil
}

func (r *UserAuthRepository) SetToken(ctx context.Context, id uuid.UUID, token *oauth2.Token) error {
	fmt.Printf("user id: %s\n", id)
	const query string = `
	INSERT INTO user_auth (user_id, access_token, token_type, refresh_token, expiry)
	VALUES ($1, $2, $3, $4, $5)
	ON CONFLICT ON CONSTRAINT user_auth_user_id_unique
	DO UPDATE SET 
		access_token = $2, 
		token_type = $3, 
		refresh_token = $4, 
		expiry = $5
	`

	if _, err := r.Exec(ctx, query, id, token.AccessToken, token.TokenType, token.RefreshToken, token.Expiry); err != nil {
		fmt.Printf("error: %v\n", err)
		return err
	}

	return nil
}

func NewUserAuthRepository(db *pgxpool.Pool) *UserAuthRepository {
	return &UserAuthRepository{
		db,
	}
}
