package routes

import "github.com/gofiber/fiber/v2"

func HelloRoutes(a *fiber.App) {
	route := a.Group("/hello")

	route.Get("/", helloWorld)
	route.Get("/:name", helloName)
}

func helloWorld(c *fiber.Ctx) error {
	return c.SendString("Hello, world!")
}

func helloName(c *fiber.Ctx) error {
	return c.SendString("Hello, " + c.Params("name") + "!")
}
