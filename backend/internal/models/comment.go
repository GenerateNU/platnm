package models

import "time"

type Comment struct {
	ID        int       `json:"id"`
	Text      string    `json:"text"`
	ReviewID  int       `json:"review_id"`
	UserID    string    `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}
