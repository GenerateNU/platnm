package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

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
	defer app.Repo.Close()

	go func() {
		if err := app.Server.Listen(":" + config.Application.Port); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit

	slog.Info("Shutting down server")
	if err := app.Server.Shutdown(); err != nil {
		slog.Error("failed to shutdown server", "error", err)
	}

	slog.Info("Server shutdown")
}
