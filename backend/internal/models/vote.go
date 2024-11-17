package models

type PostType string

type UserVote struct {
	UserID   string   `json:"user_id"`
	PostID   string   `json:"post_id"`
	Upvote   bool     `json:"upvote"`
	PostType PostType `json:"post_type"`
}
