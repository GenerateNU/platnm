package service

import (
	"net/http"
	"platnm/internal/auth"
	"platnm/internal/config"
	"platnm/internal/constants"
	"platnm/internal/errs"
	"platnm/internal/service/handler/media"
	"platnm/internal/service/handler/oauth"
	"platnm/internal/service/handler/oauth/platnm"
	spotify_oauth_handler "platnm/internal/service/handler/oauth/spotify"
	"platnm/internal/service/handler/playlist"
	"platnm/internal/service/handler/recommendation"
	spotify_handler "platnm/internal/service/handler/spotify"
	spotify_middleware "platnm/internal/service/middleware/spotify"
	platnm_session "platnm/internal/service/session"
	"platnm/internal/storage"
	"platnm/internal/storage/postgres"

	"platnm/internal/service/handler/reviews"
	"platnm/internal/service/handler/users"

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

type App struct {
	Server *fiber.App
	Repo   *storage.Repository
}

func InitApp(config config.Config) *App {
	app := setupApp()
	repo := postgres.NewRepository(config.DB)
	setupRoutes(app, repo, config)

	return &App{
		Server: app,
		Repo:   repo,
	}
}

func setupRoutes(app *fiber.App, repo *storage.Repository, config config.Config) {
	sessionStore := platnm_session.NewSessionStore(session.Config{
		Storage:    memory.New(),
		Expiration: constants.SessionDuration,
		KeyLookup:  "header:" + constants.HeaderSession,
	})

	stateStore := oauth.NewStateStore(memory.Config{})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(http.StatusOK)
	})

	userHandler := users.NewHandler(repo.User, repo.Playlist, config.Supabase, sessionStore)
	app.Route("/users", func(r fiber.Router) {
		r.Get("/", userHandler.GetUsers)
		r.Get("/:id/connections", userHandler.GetConnections)
		r.Get("/:id", userHandler.GetUserById)
		r.Get("/profile/id/:id", userHandler.GetUserProfile)
		r.Post("/follow", userHandler.FollowUnfollowUser)
		r.Get("/score/:id", userHandler.CalculateScore)
		r.Post("/", userHandler.CreateUser)
		r.Patch("/bio/:id", userHandler.UpdateUserBio)
		r.Put("/enthusiasm", userHandler.UpdateUserOnboard)
		r.Get("/feed/:id", userHandler.GetUserFeed)
		r.Get("following/:id", userHandler.GetUserFollowing)
		r.Patch("/pfp/:id", userHandler.UpdateUserProfilePicture)
		r.Post("/section", userHandler.CreateSection)
		r.Post("/section/item/:userId/:sectionId", userHandler.CreateSectionItem)
		r.Patch("/section/item", userHandler.UpdateSectionItem)
		r.Delete("/section/item", userHandler.DeleteSectionItem)
		r.Delete("/section", userHandler.DeleteSection)
		r.Get("/section/:id", userHandler.GetUserSections)
		r.Get("/section/options/:id", userHandler.GetUserSectionOptions)
		r.Get("/profile/name/:name", userHandler.GetProfileByName)
		r.Get("/notifications/:id", userHandler.GetNotifications)
	})

	app.Route("/reviews", func(r fiber.Router) {
		reviewHandler := reviews.NewHandler(repo.Review, repo.User, repo.UserReviewVote)
		r.Post("/", reviewHandler.CreateReview)
		r.Get("/popular", reviewHandler.GetReviewsByPopularity)
		r.Get("/tags", reviewHandler.GetTags)
		r.Get("/vote/:userID/:postID", func(c *fiber.Ctx) error {
			return reviewHandler.GetUserVote(c, "review")
		})

		// Get Reviews by ID which can be used to populate a preview
		r.Get("/:id", reviewHandler.GetReviewByID)
		r.Get("/media/:mediaId/:userID", reviewHandler.GetUserReviewsOfMedia)
		r.Get("/user/:id", reviewHandler.GetReviewsByUserID)
		r.Post("/vote", func(c *fiber.Ctx) error {
			return reviewHandler.UserVote(c, "review")
		})
		r.Patch("/:id", reviewHandler.UpdateReviewByReviewID)
		r.Get("/album/:id", func(c *fiber.Ctx) error {
			return reviewHandler.GetReviewsByMediaId(c, "album")
		})
		r.Get("/track/:id", func(c *fiber.Ctx) error {
			return reviewHandler.GetReviewsByMediaId(c, "track")
		})
		r.Get("/track/:userId/:mediaId", func(c *fiber.Ctx) error {
			return reviewHandler.GetUserReviewOfTrack(c)
		})
		r.Post("/comment", reviewHandler.CreateComment)
		r.Post("/comment/vote", func(c *fiber.Ctx) error {
			return reviewHandler.UserVote(c, "comment")
		})
		r.Get("/comment/vote/:userID/:postID", func(c *fiber.Ctx) error {
			return reviewHandler.GetUserVote(c, "comment")
		})
		r.Get("/social/song/:songid", func(c *fiber.Ctx) error {
			return reviewHandler.GetSocialReviews(c, "track")
		})
		r.Get("/social/album/:albumid", func(c *fiber.Ctx) error {
			return reviewHandler.GetSocialReviews(c, "album")
		})
		r.Get("/comments/:id", reviewHandler.GetComments)
	})

	mediaHandler := media.NewHandler(repo.Media)
	app.Route("/media", func(r fiber.Router) {
		m := spotify_middleware.NewMiddleware(config.Spotify, repo.UserAuth, sessionStore)
		// Apply middleware only to the specific route
		r.Get("/:name", m.WithSpotifyClient(), mediaHandler.GetMediaByName)
		r.Get("/track/:id", mediaHandler.GetTrackById)
		r.Get("/album/:id", mediaHandler.GetAlbumById)
		r.Get("/", mediaHandler.GetMedia)
	})

	recommendationHandler := recommendation.NewHandler(repo.Recommendation, repo.User)
	app.Route("/recommendation", func(r fiber.Router) {
		r.Post("/", recommendationHandler.CreateRecommendation)
		r.Patch("/:recommendationId", recommendationHandler.ReactToRecommendation)
		r.Get("/:recommendeeId", recommendationHandler.GetRecommendations)
	})

	playlistHandler := playlist.NewHandler(repo.Playlist)
	app.Route("/playlist", func(r fiber.Router) {
		r.Post("/on_queue/:userId", playlistHandler.AddToUserOnQueue)
		r.Get("/on_queue/:userId", playlistHandler.GetUserOnQueue)
	})

	// change to /oauth once its changed in spotify dashboard
	app.Route("/auth", func(r fiber.Router) {
		r.Route("/spotify", func(r fiber.Router) {
			h := spotify_oauth_handler.NewHandler(sessionStore, stateStore, config.Spotify, repo.UserAuth)

			r.Get("/begin", h.Begin)
			r.Get("/callback", h.Callback)
		})
		r.Route("/platnm", func(r fiber.Router) {
			h := platnm.NewHandler(sessionStore, config.Supabase)
			r.Post("/login", h.Login)
			r.Get("/health", func(c *fiber.Ctx) error {
				return c.SendStatus(http.StatusOK)
			})
			r.Post("/forgot", h.ForgotPassword)
			r.Post("/signout", h.SignOut)
			r.Post("/deactivate", h.DeactivateAccount)
			r.Put("/resetpassword", h.ResetPassword)
		})
	})

	app.Route("/spotify", func(r fiber.Router) {
		h := spotify_handler.NewHandler(repo.Media)
		m := spotify_middleware.NewMiddleware(config.Spotify, repo.UserAuth, sessionStore)

		r.Route("/clientCreds", func(clientCredRoute fiber.Router) {
			clientCredRoute.Use(m.WithSpotifyClient())
			clientCredRoute.Get("/", h.GetPlatnmPlaylist)
			clientCredRoute.Get("/import/new-releases", h.NewReleases)
			clientCredRoute.Post("/import/recommendations", h.ImportRecommendations)
			clientCredRoute.Patch("/import/artist-details", h.GetArtistDetails)
		})

		r.Route("/", func(authRoute fiber.Router) {
			authRoute.Use(m.WithAuthenticatedSpotifyClient())
			authRoute.Get("/playlists", h.GetCurrentUserPlaylists)
			authRoute.Get("/top-items", h.GetTopItems)
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
