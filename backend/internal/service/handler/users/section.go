package users

import (
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
)

type Section struct {
	models.SectionType
}

type SectionItem struct {
	models.SectionItem
}

type SectionTypeItem struct {
	models.SectionTypeItem
}

func (h *Handler) CreateSection(c *fiber.Ctx) error {
	var body Section

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	section, err := h.userRepository.CreateSection(c.Context(), body.SectionType)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to unfollow user",
		})
	}
	return c.Status(fiber.StatusOK).JSON(section)
}

func (h *Handler) CreateSectionItem(c *fiber.Ctx) error {
	var body SectionItem
	id := c.Params("userId")
	sectionId := c.Params("sectionId")
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	item, err := h.userRepository.CreateSectionItem(c.Context(), body.SectionItem, id, sectionId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create section item",
		})
	}
	return c.Status(fiber.StatusOK).JSON(item)
}

func (h *Handler) UpdateSectionItem(c *fiber.Ctx) error {
	var body SectionItem

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	err := h.userRepository.UpdateSectionItem(c.Context(), body.SectionItem)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create section item",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"sucess": "Updating item in section",
	})
}

func (h *Handler) DeleteSectionItem(c *fiber.Ctx) error {
	var body SectionTypeItem

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	err := h.userRepository.DeleteSectionItem(c.Context(), body.SectionTypeItem)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to Delete Section Item",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"sucess": "Deleting item in section",
	})
}

func (h *Handler) DeleteSection(c *fiber.Ctx) error {
	var body SectionTypeItem

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	err := h.userRepository.DeleteSection(c.Context(), body.SectionTypeItem)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to Delete Section Item",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"sucess": "Deleting item in section",
	})
}

func (h *Handler) GetUserSections(c *fiber.Ctx) error {
	id := c.Params("id")

	sections, err := h.userRepository.GetUserSections(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get user sections",
		})
	}

	if sections == nil {
		sections = []models.UserSection{}
	}

	return c.Status(fiber.StatusOK).JSON(sections)
}

func (h *Handler) GetUserSectionOptions(c *fiber.Ctx) error {
	id := c.Params("id")

	options, err := h.userRepository.GetUserSectionOptions(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get section option",
		})
	}

	return c.Status(fiber.StatusOK).JSON(options)
}
