package media

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetMediaByName(c *fiber.Ctx) error {
	name := c.Params("name")
	medias, _ := h.mediaRepository.GetMediaByName(c.Context(), name)
	return c.Status(fiber.StatusOK).JSON(medias)
}

func (h *Handler) GetMedia(c *fiber.Ctx) error {
	// Check for the "type" query parameter
	mediaType := c.Query("sort")
	fmt.Println(mediaType)
	if mediaType == "recent" {
		// Call the method to get recent media if the "type" query parameter is "recent"
		medias, err := h.mediaRepository.GetMediaByDate(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch recent media"})
		}
		return c.Status(fiber.StatusOK).JSON(medias)
	}

	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid type query parameter"})
}
