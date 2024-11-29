package models

import "time"

type User struct {
	ID             string    `json:"user_id"`
	Username       string    `json:"username"`
	Email          string    `json:"email"`
	DisplayName    string    `json:"display_name"`
	Bio            string    `json:"bio"`
	ProfilePicture string    `json:"profile_picture"`
	LinkedAccount  string    `json:"linked_account"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Notification struct {
	ID               int       `json:"id"`
	Thumbnail        string    `json:"thumbnail"` // Url of the notification thumbnail
	CreatedAt        time.Time `json:"created_at"`
	Type             string    `json:"type"`        // Type of the notifcation
	RecieverID       string    `json:"reciever_id"` // Reciever of the notification
	TaggedEntityID   string    `json:"tagged_entity_id"`
	TaggedEntityType string    `json:"tagged_entity_type"`
	TaggedEntityName string    `json:"tagged_entity_name"`
}
