package postgres

import (
	"context"
	"fmt"
	"log"
	"platnm/internal/storage"
	review "platnm/internal/storage/postgres/schema"
	user "platnm/internal/storage/postgres/schema"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func ConnectDatabase(host, user, password, dbname, port string) *pgxpool.Pool {
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=require statement_cache_mode=describe pgbouncer=true", host, user, password, dbname, port)

	dbConfig, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatal("Failed to create a config, error: ", err)
	}

	dbConfig.BeforeClose = func(c *pgx.Conn) {
		log.Fatal("Closed the connection pool to the database!")
	}

	conn, err := pgxpool.NewWithConfig(context.Background(), dbConfig)
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}

	err = conn.Ping(context.Background())
	if err != nil {
		log.Fatal("Ping failed:", err)
	}

	log.Print("Connected to database!")

	return conn
}

func NewRepository(db *pgxpool.Pool) *storage.Repository {
	return &storage.Repository{
		User:   user.NewUserRepository(db),
		Review: review.NewReviewRepository(db),
	}
}
