package models

import (
	"database/sql"
	"time"
)

type UserComment struct {
	CommentID      string
	Comment        sql.NullString
	ReviewID       string
	UserID         string
	Username       sql.NullString
	DisplayName    sql.NullString
	ProfilePicture sql.NullString
	CreatedAt      time.Time
	// Upvotes        int       `json:"upvotes"`
	// Downvotes      int       `json:"downvotes"`
}
