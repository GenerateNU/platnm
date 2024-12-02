package models

import "time"

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

type Notification struct {
	ID               int       `json:"id"`
	Thumbnail        string    `json:"thumbnail"` // Url of the notification thumbnail
	CreatedAt        time.Time `json:"created_at"`
	Type             string    `json:"type"`        // Type of the notifcation
	ReceiverID       string    `json:"receiver_id"` // Reciever of the notification
	TaggedEntityID   string    `json:"tagged_entity_id"`
	TaggedEntityType string    `json:"tagged_entity_type"`
	TaggedEntityName string    `json:"tagged_entity_name"`
}
