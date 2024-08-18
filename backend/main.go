package main

import (
	"platnm/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()

	// Middleware
	app.Use(logger.New())

	// Routes
	routes.HelloRoutes(app)

	app.Listen(":8080")
}
