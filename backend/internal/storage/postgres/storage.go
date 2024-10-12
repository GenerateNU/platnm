package postgres

import (
	"context"
	"log"
	"platnm/internal/config"
	"platnm/internal/storage"
	"platnm/internal/storage/postgres/schema"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func ConnectDatabase(config config.DB) *pgxpool.Pool {
	dbConfig, err := pgxpool.ParseConfig(config.Connection())
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

func NewRepository(config config.DB) *storage.Repository {
	db := ConnectDatabase(config)

	return &storage.Repository{
		User:           schema.NewUserRepository(db),
		Review:         schema.NewReviewRepository(db),
		Media:          schema.NewMediaRepository(db),
		Recommendation: schema.NewRecommendationRepository(db),
	}
}
