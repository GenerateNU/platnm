package models

import "time"

type Review struct {
	UserID         string  `json:"user_id"`
	MediaType      string  `json:"media_type"`
	MediaID        string  `json:"media_id"`
	Rating         string  `json:"rating"`
	Desc          *string `json:"desc,omitempty"`
	CreatedAt time.Time `json:"created_at"`
 	UpdatedAt time.Time `json:"updated_at"`
}
