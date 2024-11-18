package models

import "time"

type Review struct {
	ID             int       `json:"id"`
	UserID         string    `json:"user_id"`
	MediaType      MediaType `json:"media_type"`
	MediaID        int       `json:"media_id"`
	Rating         int       `json:"rating"`
	Comment        string    `json:"comment"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	Username       string    `json:"username"`
	DisplayName    string    `json:"display_name"`
	ProfilePicture string    `json:"profile_picture"`
	Draft          bool      `json:"draft"`
	Tags           []string  `json:"tags"`
}

type ReviewStat struct {
	ID           int `json:"id"`
	CommentCount int `json:"comment_count"`
	Upvotes      int `json:"upvotes"`
	Downvotes    int `json:"downvotes"`
}

type FriendReview struct {
	Rating      int    `json:"rating"`
	Comment     string `json:"comment"`
	Displayname string `json:"display_name"`
	Username    string `json:"username"`
}
