package auth

import (
	"context"
	"platnm/internal/config"
	"platnm/internal/storage/postgres/schema"

	"github.com/gofiber/fiber"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Claims struct {
	DB     *pgxpool.Pool
	Config *config.Supabase
}

func (c *Claims) Middleware() func(ctx *fiber.Ctx) error {
	return func(ctx *fiber.Ctx) error {
		token := ctx.Get("Authorization", "")

		if token == "" {
			return ctx.Status(fiber.StatusUnauthorized).JSON((fiber.Map{"code": "unauthorized, token not found"}))
		}
		payload, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
			return []byte(c.Config.JWTSecret), nil
		})
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON((fiber.Map{"code": "unauthorized, token failed to parse"}))
		}

		// Subject will be user's UUID
		subject, err := payload.Claims.GetSubject()
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON((fiber.Map{"code": "missing subject"}))
		}

		userRepository := schema.NewUserRepository(c.DB)
		userExists, err := userRepository.UserExists(context.Background(), subject)
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON((fiber.Map{"code": "server error"}))
		}

		if !userExists {
			return ctx.Status(fiber.StatusUnauthorized).JSON((fiber.Map{"code": "no such user exists"}))
		}

		ctx.Locals("userId", subject)
		ctx.Next()
		return nil
	}
}
