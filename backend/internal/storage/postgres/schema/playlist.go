package schema

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type PlaylistRepository struct {
	*pgxpool.Pool
}


