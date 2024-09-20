package service

import (
	"platnm/internal/service/handler"
	"platnm/internal/storage/postgres"

	go_json "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Params struct {
	Conn *pgxpool.Pool
}

func InitApp(params Params) *fiber.App {
	app := setupApp()

	setupRoutes(app, params.Conn)

	return app
}

func setupRoutes(app *fiber.App, conn *pgxpool.Pool) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	repository := postgres.NewRepository(conn)
	userHandler := handler.NewUserHandler(repository.User)
	app.Route("/users", func(r fiber.Router) {
		r.Get("/", userHandler.GetUsers)
		r.Get("/:id", userHandler.GetUserById)
	})

	reviewHandler := handler.NewReviewHandler(repository.Review)
	app.Route("/reviews", func(r fiber.Router) {
		r.Get("/album", reviewHandler.GetReviews)
		r.Get("/:albumID", reviewHandler.GetReviewsById("album"))
	})

	reviewHandler := handler.NewReviewHandler(repository.Review)
	app.Route("/reviews", func(r fiber.Router) {
		r.Get("/track", reviewHandler.GetReviews)
		r.Get("/:trackID", reviewHandler.GetReviewsById("track"))
	})
}

func setupApp() *fiber.App {
	app := fiber.New(fiber.Config{
		JSONEncoder: go_json.Marshal,
		JSONDecoder: go_json.Unmarshal,
		// ErrorHandler: errs.ErrorHandler,
	})
	app.Use(recover.New())
	app.Use(requestid.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${ip}:${port} ${pid} ${locals:requestid} ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))

	return app
}
