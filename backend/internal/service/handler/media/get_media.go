package media

import (
	"platnm/internal/errs"
	"platnm/internal/service/utils"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetMediaByName(c *fiber.Ctx) error {
	name := c.Params("name")
	medias, _ := h.mediaRepository.GetMediaByName(c.Context(), name)
	return c.Status(fiber.StatusOK).JSON(medias)
}

type getMediaRequest struct {
	utils.Pagination
	Sort string `query:"sort"`
}

func (h *Handler) GetMedia(c *fiber.Ctx) error {
	var req getMediaRequest
	if err := c.QueryParser(&req); err != nil {
		return errs.BadRequest("Invalid query parameters")
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
		media, err := h.mediaRepository.GetMediaByReviews(c.Context(), req.Limit, req.GetOffset())
		if err != nil {
			return err
		}

		return c.Status(fiber.StatusOK).JSON(media)
	default:
		return errs.BadRequest("Invalid sort query parameter")
	}
}
