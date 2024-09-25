package models

import "time"

type Media struct {
	ID          int       `json:"id"`
	MediaType   MediaType `json:"media_type"`
	Title       string    `json:"title"`
	ReleaseDate time.Time `json:"release_date"`
	Cover       string    `json:"cover"`
	Country     time.Time `json:"country"`
	GenreID     int       `json:"genre_id"`
}

type MediaType string

const (
	Track MediaType = "track"
	Album MediaType = "album"
)
