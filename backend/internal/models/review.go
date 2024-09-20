package models

import "time"

type Review struct {
	ReviewID  int       `json:"id"`
	UserID    string    `json:"user_id"`
	MediaID   int       `json:"media_id"`
	MediaType MediaType `json:"media_type"`
	Rating    int       `json:"rating"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Comment   string    `json:"comment"`
}

// mediatype can be either track or album
type MediaType string

const (
	Track MediaType = "track"
	Album MediaType = "album"
)
