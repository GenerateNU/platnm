package main

import (
	"context"
	"log"
	"os"

	"platnm/internal/config"
	"platnm/internal/service"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
	"github.com/sethvargo/go-envconfig"
)

func main() {
	// Load environment variables
	var config config.Config
	if err := envconfig.Process(context.Background(), &config); err != nil {
		log.Fatalln("Error processing .env file: ", err)
	}

	app := service.InitApp(config)

	if err := listner(app, config.Application.Port)(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func listner(app *fiber.App, port string) func() error {
	if os.Getenv("APP_ENVIRONMENT") != "production" {
		return func() error { return app.Listen(":" + port) }
	}

	return func() error { return app.ListenTLS(":"+port, "server.crt", "server.key") }
}
