package models

import ( 
	"time"
"database/sql"

)

type User struct {
	ID             string    `json:"user_id" db:"id"`
	Username       string    `json:"username" db:"username"`
	Email          string    `json:"email" db:"email"`
	DisplayName    string    `json:"display_name" db:"display_name"`
	Bio            string    `json:"bio" db:"bio"`
	ProfilePicture string    `json:"profile_picture" db:"profile_picture"`
	LinkedAccount  string    `json:"linked_account" db:"linked_account"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

type Connections struct {
	Followees []User `json:"followees"`
	Followers []User `json:"followers"`
}

type Follower struct {
	ID             string         `db:"id"`
	Username       string         `db:"username"`
	Email          string         `db:"email"`
	DisplayName    string         `db:"display_name"`
	Bio            sql.NullString `db:"bio"`
	ProfilePicture sql.NullString `db:"profile_picture"`
	LinkedAccount  sql.NullString `db:"linked_account"`
	CreatedAt      time.Time      `db:"created_at"`
	UpdatedAt      time.Time      `db:"updated_at"`
}