package models

import "time"

type Review struct {
	ReviewID  int       `json:"id"`
	UserID    string    `json:"user_id"`
	MediaID   int       `json:"media_id"`
	MediaType MediaType `json:"media_type"`
	Rating    int       `json:"rating"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Comment   string    `json:"comment"`
}

// mediatype can be either track or album
type MediaType string

const (
	track MediaType = "track"
	album MediaType = "album"
)

func (r *Review) Validate() map[string]string {
	var errs = make(map[string]string)

	if r.Rating < 1 || r.Rating > 10 {
		errs["rating"] = "rating must be between 1 and 10"
	}

	if r.MediaType != track && r.MediaType != album {
		errs["media_type"] = "media_type must be either track or album"
	}
	return errs
}
