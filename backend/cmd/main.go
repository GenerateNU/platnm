package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	sqlc "platnm/database/sqlc"

	"platnm/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	app := fiber.New()

	// Middleware
	app.Use(logger.New())

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=require", host, user, password, name, port)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to initialize the database: ", err)
	}

	queries := sqlc.New(db)
	ctx := context.Background()

	// list all authors
	testData, err := queries.GetTestData(ctx)
	if err != nil {
		fmt.Println(err)
	}
	log.Println(testData)

	// Routes
	routes.HelloRoutes(app)

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
