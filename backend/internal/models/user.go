package models

import "time"

type User struct {
	ID             string    `json:"user_id"`
	Username       string    `json:"first_name"`
	DisplayName    string    `json:"display_name"`
	Bio            string    `json:"email"`
	ProfilePicture string    `json:"profile_picture"`
	LinkedAccount  string    `json:"linked_account"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
