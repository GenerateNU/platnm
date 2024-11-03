package models

import (
	"database/sql"
	"time"
)

type FeedPost struct {
	ID             int            `json:"id"`
	UserID         string         `json:"user_id"`
	Username       string         `json:"username"`
	ProfilePicture string         `json:"profile_picture"`
	MediaType      MediaType      `json:"media_type"`
	MediaID        int            `json:"media_id"`
	Rating         int            `json:"rating"`
	Comments       int            `json:"comments"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	Upvotes        int            `json:"upvotes"`
	Downvotes      int            `json:"downvotes"`
	MediaCover     sql.NullString `json:"media_cover"`
	MediaTitle     sql.NullString `json:"media_title"`
	MediaArtist    sql.NullString `json:"media_artist"`
}
