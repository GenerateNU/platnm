package main

import (
	"context"
	"log"

	"platnm/internal/config"
	"platnm/internal/service"

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

	if err := app.Listen(":" + config.Application.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
