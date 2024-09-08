package models

type User struct {
	UserID         string  `json:"user_id"`
	FirstName      string  `json:"first_name"`
	LastName       string  `json:"last_name"`
	Email          string  `json:"email"`
	Phone          *string `json:"phone,omitempty"`
	ProfilePicture *string `json:"profile_picture,omitempty"`
}
