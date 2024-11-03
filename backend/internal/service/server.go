package service

import (
	"net/http"
	"platnm/internal/auth"
	"platnm/internal/config"
	"platnm/internal/constants"
	"platnm/internal/errs"
	"platnm/internal/service/handler/media"
	"platnm/internal/service/handler/oauth/platnm"
	spotify_oauth_handler "platnm/internal/service/handler/oauth/spotify"
	"platnm/internal/service/handler/playlist"
	"platnm/internal/service/handler/recommendation"
	spotify_handler "platnm/internal/service/handler/spotify"
	spotify_middleware "platnm/internal/service/middleware/spotify"
	platnm_session "platnm/internal/service/session"

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
	sessionStore := platnm_session.NewSessionStore(session.Config{
		Storage:    memory.New(),
		Expiration: constants.SessionDuration,
		KeyLookup:  "header:" + constants.HeaderSession,
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(http.StatusOK)
	})

	repository := postgres.NewRepository(config.DB)
	userHandler := users.NewHandler(repository.User, repository.Playlist)
	app.Route("/users", func(r fiber.Router) {
		r.Get("/", userHandler.GetUsers)
		r.Get("/:id", userHandler.GetUserById)
		r.Get("/profile/:id", userHandler.GetUserProfile)
		r.Post("/follow", userHandler.FollowUnfollowUser)
		r.Get("/score/:id", userHandler.CalculateScore)
		r.Post("/", userHandler.CreateUser)
	})

	app.Route("/reviews", func(r fiber.Router) {
		reviewHandler := reviews.NewHandler(repository.Review, repository.User, repository.UserReviewVote)
		r.Post("/", reviewHandler.CreateReview)
		r.Get("/:id", reviewHandler.GetReviewsByUserID)
		r.Post("/vote/:rating", reviewHandler.VoteReview)
		r.Patch("/:id", reviewHandler.UpdateReviewByReviewID)
		r.Get("/album/:id", func(c *fiber.Ctx) error {
			return reviewHandler.GetReviewsById(c, "album")
		})
		r.Get("/track/:id", func(c *fiber.Ctx) error {
			return reviewHandler.GetReviewsById(c, "track")
		})
		r.Post("/comment", reviewHandler.CreateComment)
	})

	mediaHandler := media.NewHandler(repository.Media)
	app.Route("/media", func(r fiber.Router) {
		m := spotify_middleware.NewMiddleware(config.Spotify, repository.UserAuth, sessionStore)
		// Apply middleware only to the specific route
		r.Get("/:name", m.WithSpotifyClient(), mediaHandler.GetMediaByName)
		r.Get("/", mediaHandler.GetMedia)
	})

	recommendationHandler := recommendation.NewHandler(repository.Recommendation, repository.User)
	app.Route("/recommendation", func(r fiber.Router) {
		r.Post("/", recommendationHandler.CreateRecommendation)
		r.Patch("/:recommendationId", recommendationHandler.ReactToRecommendation)
		r.Get("/:recommendeeId", recommendationHandler.GetRecommendations)
	})

	playlistHandler := playlist.NewHandler(repository.Playlist)
	app.Route("/playlist", func(r fiber.Router) {
		r.Post("/on_queue/:userId", playlistHandler.AddToUserOnQueue)
	})

	// change to /oauth once its changed in spotify dashboard
	app.Route("/auth", func(r fiber.Router) {
		r.Route("/spotify", func(r fiber.Router) {
			h := spotify_oauth_handler.NewHandler(sessionStore, config.Spotify, repository.UserAuth)

			r.Get("/begin/:userID", h.Begin)
			r.Get("/callback", h.Callback)
		})
		r.Route("/platnm", func(r fiber.Router) {
			h := platnm.NewHandler(sessionStore, config.Supabase)
			r.Post("/login", h.Login)
			r.Get("/health", func(c *fiber.Ctx) error {
				return c.SendStatus(http.StatusOK)
			})
		})
	})

	app.Route("/spotify", func(r fiber.Router) {
		h := spotify_handler.NewHandler(repository.Media)
		m := spotify_middleware.NewMiddleware(config.Spotify, repository.UserAuth, sessionStore)

		r.Route("/:userID", func(authRoute fiber.Router) {
			authRoute.Use(m.WithAuthenticatedSpotifyClient())
			authRoute.Get("/playlists", h.GetCurrentUserPlaylists)
			authRoute.Get("/top-items", h.GetTopItems)
		})

		r.Route("/", func(clientCredRoute fiber.Router) {
			clientCredRoute.Use(m.WithSpotifyClient())
			clientCredRoute.Get("/", h.GetPlatnmPlaylist)
			clientCredRoute.Get("/new-releases", h.NewReleases)
		})
	})

	app.Get("/secret", auth.Middleware(&config.Supabase), func(c *fiber.Ctx) error {
		return c.SendStatus(http.StatusOK)
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
