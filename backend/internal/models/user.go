package models

import "time"

type User struct {
	ID             string    `json:"user_id"`
	Username       string    `json:"username"`
	DisplayName    string    `json:"display_name"`
	Bio            string    `json:"bio"`
	ProfilePicture string    `json:"profile_picture"`
	LinkedAccount  string    `json:"linked_account"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
