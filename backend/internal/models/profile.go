package models

import "database/sql"

type Profile struct {
	UserID         string         `json:"user_id"`
	Username       string         `json:"username"`
	DisplayName    string         `json:"display_name"`
	ProfilePicture sql.NullString `json:"profile_picture"`
	Bio            sql.NullString `json:"bio"`
	Score          int            `json:"score"`
	Followers      int            `json:"followers"`
	Followed       int            `json:"followed"`
}
