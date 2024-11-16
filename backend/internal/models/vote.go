package models

type PostType string

type UserVote struct {
	VoteID   string   `json:"vote_id"`
	UserID   string   `json:"user_id"`
	PostID   string   `json:"review_id"`
	Upvote   bool     `json:"upvote"`
	PostType PostType `json:"post_type"`
}
