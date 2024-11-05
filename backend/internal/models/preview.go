package models

import (
	"time"
)

type Preview struct {
	ID             int        `json:"id"`
	UserID         string     `json:"user_id"`
	Username       string     `json:"username"`
	DisplayName    string     `json:"display_name"`
	ProfilePicture string     `json:"profile_picture"`
	MediaType      MediaType  `json:"media_type"`
	MediaID        int        `json:"media_id"`
	Rating         int        `json:"rating"`
	Comment        *string    `json:"comment"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	MediaCover     string     `json:"media_cover"`
	MediaTitle     string     `json:"media_title"`
	MediaArtist    string     `json:"media_artist"`
	Tags           []string   `json:"tags"`
	ReviewStat     ReviewStat `json:"review_stat"`
}
