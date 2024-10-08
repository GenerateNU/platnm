package auth

import (
	"fmt"
	"platnm/internal/config"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func parseJWTToken(token string, hmacSecret []byte) (email string, err error) {
	t, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return hmacSecret, nil
	})

	if err != nil {
		return "", fmt.Errorf("error validating token: %v", err)
	} else if claims, ok := t.Claims.(*Claims); ok {
		return claims.Email, nil
	}

	return "", fmt.Errorf("error parsing token: %v", err)
}

func Middleware(cfg *config.Supabase) fiber.Handler {

	return func(ctx *fiber.Ctx) error {

		token := ctx.Get("Authorization", "")
		token = strings.TrimPrefix(token, "Bearer ")

		if token == "" {
			return ctx.Status(400).JSON(fiber.Map{"code": "unauthorized, token not found"})
		}
		_, err := parseJWTToken(token, []byte(cfg.JWTSecret))

		if err != nil {
			return ctx.Status(400).JSON(fiber.Map{"code": "unauthorized, error parsing token"})
		}
		return ctx.Next()
	}
}
