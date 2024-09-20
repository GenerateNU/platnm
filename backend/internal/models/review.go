package models

import "time"

type Review struct {
	ID        int       `json:"id"`
	UserID    string    `json:"user_id"`
	MediaType MediaType `json:"media_type"`
	MediaID   int       `json:"media_id"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// mediatype can be either track or album
type MediaType string

const (
	Track MediaType = "track"
	Album MediaType = "album"
)
