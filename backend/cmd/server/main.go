package main

import (
	"context"
	"log"

	"platnm/internal/config"
	"platnm/internal/service"
	"platnm/internal/storage/postgres"

	_ "github.com/lib/pq"
	"github.com/sethvargo/go-envconfig"
)

func main() {
	// Load environment variables
	var config config.Config
	if err := envconfig.Process(context.Background(), &config); err != nil {
		log.Fatalln("Error processing .env file: ", err)
	}

	// Connect to database
	conn := postgres.ConnectDatabase(config.DbHost, config.DbUser, config.DbPassword, config.DbName, config.DbPort)
	app := service.InitApp(service.Params{Conn: conn})

	defer conn.Close()

	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
