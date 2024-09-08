package handler

import (
	"context"
	"platnm/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserHandler struct {
	conn *pgxpool.Pool
}

func NewUserHandler(conn *pgxpool.Pool) *UserHandler {
	return &UserHandler{
		conn,
	}
}

func (h *UserHandler) GetUsers(c *fiber.Ctx) error {
	rows, err := h.conn.Query(context.Background(), "SELECT user_id, first_name, last_name, phone, email, address, profile_picture FROM users")
	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		var firstName, lastName, phone, email, address, profilePicture *string

		if err := rows.Scan(&user.UserID, &firstName, &lastName, &phone, &email, &address, &profilePicture); err != nil {
			print(err.Error(), "from transactions err ")
			return err
		}

		user.FirstName = *firstName
		user.LastName = *lastName
		user.Email = *email
		user.Phone = phone
		user.ProfilePicture = profilePicture

		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}

	return c.Status(fiber.StatusOK).JSON(users)
}

func (h *UserHandler) GetUserById(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User
	err := h.conn.QueryRow(context.Background(), "SELECT user_id, first_name, last_name, phone, email, profile_picture FROM users WHERE user_id = $1", id).Scan(&user.UserID, &user.FirstName, &user.LastName, &user.Phone, &user.Email, &user.ProfilePicture)

	if err != nil {
		print(err.Error(), "from transactions err ")
		return err
	}
	return c.Status(fiber.StatusOK).JSON(user)
}
