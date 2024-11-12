package models

import (
	"time"
)

type UserComment struct {
	CommentID      string    `json:"comment_id"`
	Comment        string    `json:"comment"`
	ReviewID       string    `json:"review_id"`
	UserID         string    `json:"user_id"`
	Username       string    `json:"username"`
	DisplayName    string    `json:"display_name"`
	ProfilePicture *string   `json:"profile_picture"`
	CreatedAt      time.Time `json:"created_at"`
	// Upvotes        int       `json:"upvotes"`
	// Downvotes      int       `json:"downvotes"`
}
