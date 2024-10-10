package models

type UserReviewVote struct {
	UserID   string `json:"user_id"`
	ReviewID string `json:"review_id"`
	Upvote   bool   `json:"upvote"`
}
