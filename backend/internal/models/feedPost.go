package models

import (
	"time"
)

type FeedPost struct {
	ID             int       `json:"id"`
	UserID         string    `json:"user_id"`
	Username       string    `json:"username"`
	ProfilePicture string    `json:"profile_picture"`
	MediaType      MediaType `json:"media_type"`
	MediaID        int       `json:"media_id"`
	Rating         int       `json:"rating"`
	Comment        string    `json:"comment"`
	CommentCount   int       `json:"comment_count"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	Upvotes        int       `json:"upvotes"`
	Downvotes      int       `json:"downvotes"`
	MediaCover     string    `json:"media_cover"`
	MediaTitle     string    `json:"media_title"`
	MediaArtist    string    `json:"media_artist"`
}
