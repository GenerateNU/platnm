package models

import "time"

type Review struct {
	ID         string     `json:"id"`
	UserID     int        `json:"user_id"`   
	MediaID    int        `json:"media_id"`
	MediaType  string     `json:"media_type"`
	Rating     int        `json:"rating"`
	Comment    string    `json:"comment"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
