package routes

import "github.com/gofiber/fiber/v2"

func HelloRoutes(a *fiber.App) {
	route := a.Group("/hello")

	route.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, world!")
	})
}
