package handler

import (
	"github.com/gofiber/fiber/v2"
)

type HelloHandler struct {
}

func NewHelloHandler() *HelloHandler {
	return &HelloHandler{}
}

func (h *HelloHandler) GetHello(c *fiber.Ctx) error {
	return c.SendString("Hello, world!")
}

func (h *HelloHandler) GetHelloName(c *fiber.Ctx) error {
	name := c.Params("id")
	return c.SendString("Hello, " + name + "!")
}
