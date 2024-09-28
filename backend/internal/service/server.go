package service

import (
	"net/http"
	"platnm/internal/config"
	"platnm/internal/constants"
	"platnm/internal/errs"
	"platnm/internal/service/handler/media"
	"platnm/internal/service/handler/oauth"
	spotify_oauth_handler "platnm/internal/service/handler/oauth/spotify"
	spotify_handler "platnm/internal/service/handler/spotify"
	spotify_middleware "platnm/internal/service/middleware/spotify"

	"platnm/internal/service/handler/reviews"
	"platnm/internal/service/handler/users"

	"platnm/internal/storage/postgres"

	go_json "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage/memory"
)

func InitApp(config config.Config) *fiber.App {
	app := setupApp()

	setupRoutes(app, config)

	return app
}

func setupRoutes(app *fiber.App, config config.Config) {
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(http.StatusOK)
	})

	repository := postgres.NewRepository(config.DB)
	userHandler := users.NewHandler(repository.User)
	app.Route("/users", func(r fiber.Router) {
		r.Get("/", userHandler.GetUsers)
		r.Get("/:id", userHandler.GetUserById)
		r.Post("/follow", userHandler.FollowUnfollowUser)
	})

	app.Route("/reviews", func(r fiber.Router) {
		reviewHandler := reviews.NewHandler(repository.Review, repository.User)
		r.Post("/", reviewHandler.CreateReview)
		r.Get("/:id", reviewHandler.GetReviewsByUserID)
		r.Get("/album/:id", func(c *fiber.Ctx) error {
			return reviewHandler.GetReviewsById(c, "album")
		})
		r.Get("/track/:id", func(c *fiber.Ctx) error {
			return reviewHandler.GetReviewsById(c, "track")
		})
	})

	mediaHandler := media.NewHandler(repository.Media)
	app.Route("/media", func(r fiber.Router) {
		r.Get("/:name", mediaHandler.GetMediaByName)
	})

	// this store can be passed to other oauth handlers that need to manage state/verifier values
	store := oauth.NewStateStore(session.Config{
		Storage:    memory.New(),
		Expiration: constants.SessionDuration,
		KeyLookup:  "header:" + constants.HeaderSession,
	})

	// change to /oauth once its changed in spotify dashboard
	app.Route("/auth", func(r fiber.Router) {
		r.Route("/spotify", func(r fiber.Router) {
			h := spotify_oauth_handler.NewHandler(store, config.Spotify)

			r.Get("/begin", h.Begin)
			r.Get("/callback", h.Callback)
		})
	})

	app.Route("/spotify", func(r fiber.Router) {
		h := spotify_handler.NewHandler()
		m := spotify_middleware.NewMiddleware(config.Spotify)

		r.Use(m.WithSpotifyClient())
		r.Get("/", h.GetPlatnmPlaylist)
	})
}

func setupApp() *fiber.App {
	app := fiber.New(fiber.Config{
		JSONEncoder:  go_json.Marshal,
		JSONDecoder:  go_json.Unmarshal,
		ErrorHandler: errs.ErrorHandler,
	})
	app.Use(recover.New())
	app.Use(requestid.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${ip}:${port} ${pid} ${locals:requestid} ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(favicon.New())
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE",
	}))

	return app
}
