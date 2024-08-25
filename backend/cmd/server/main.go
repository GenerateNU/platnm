package main

import (
	"context"
	"log"

	"platnm/internal/config"
	"platnm/internal/database"
	"platnm/internal/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	_ "github.com/lib/pq"
	"github.com/sethvargo/go-envconfig"
)

func main() {
	app := fiber.New()

	// Middleware
	app.Use(logger.New())

	// Load environment variables
	var config config.Config
	if err := envconfig.Process(context.Background(), &config); err != nil {
		log.Fatalln("Error processing .env file: ", err)
	}

	// Connect to database
	conn := database.ConnectDatabase(config.DbHost, config.DbUser, config.DbPassword, config.DbName, config.DbPort)

	defer conn.Close()

	// Routes
	routes.HelloRoutes(app)
	// routes.UserRoutes(app, conn)

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
