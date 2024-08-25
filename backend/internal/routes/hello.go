package routes

import (
	"platnm/internal/handler"

	"github.com/gofiber/fiber/v2"
)

func HelloRoutes(a *fiber.App) {
	route := a.Group("/hello")

	handler := handler.NewHelloHandler()

	route.Get("/", handler.GetHello)
	route.Get("/:name", handler.GetHelloName)
}
