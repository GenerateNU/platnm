package models

import "time"

type Review struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	MediaID   string    `json:"media_id"`
	MediaType string    `json:"media_type"`
	Rating    string    `json:"rating"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
