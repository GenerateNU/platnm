package media

import (
	"platnm/internal/errs"
	"platnm/internal/models"
	"platnm/internal/service/utils"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetTrackById(c *fiber.Ctx) error {
	id := c.Params("id")
	print(id)
	media, err := h.mediaRepository.GetTrackById(c.Context(), id)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(media)
}

func (h *Handler) GetAlbumById(c *fiber.Ctx) error {
	id := c.Params("id")
	print(id)
	media, err := h.mediaRepository.GetAlbumById(c.Context(), id)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(media)
}


func (h *Handler) GetMediaByName(c *fiber.Ctx) error {
	name := c.Params("name")
	typeString := c.Query("media_type")

	var mediaType models.MediaType

	switch typeString {
	case "album":
		mediaType = models.AlbumMedia
	case "track":
		mediaType = models.TrackMedia
	case "":
		mediaType = models.BothMedia
	}
	medias, _ := h.mediaRepository.GetMediaByName(c.Context(), name, mediaType)
	return c.Status(fiber.StatusOK).JSON(medias)
}



func (h *Handler) GetMedia(c *fiber.Ctx) error {
	type request struct {
		utils.Pagination
		Sort      string `query:"sort"`
		MediaType string `query:"type"`
	}

	var req request
	if err := c.QueryParser(&req); err != nil {
		return errs.BadRequest("invalid query parameters")
	}

	if errMap := req.Validate(); len(errMap) > 0 {
		return errs.InvalidRequestData(errMap)
	}

	switch req.Sort {
	case "recent":
		media, err := h.mediaRepository.GetMediaByDate(c.Context())
		if err != nil {
			return err
		}

		return c.Status(fiber.StatusOK).JSON(media)
	case "reviews":
		media, err := h.mediaRepository.GetMediaByReviews(c.Context(), req.Limit, req.GetOffset(), &req.MediaType)
		if err != nil {
			return err
		}

		return c.Status(fiber.StatusOK).JSON(media)
	default:
		// if no sort query parameter is provided, default to some arbitrary sorting order
		media, err := h.mediaRepository.GetMediaByReviews(c.Context(), req.Limit, req.GetOffset(), &req.MediaType)
		if err != nil {
			return err
		}

		return c.Status(fiber.StatusOK).JSON(media)
	}
}
