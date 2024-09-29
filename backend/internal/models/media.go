package models

import "time"

type MediaType string

const (
	TrackMedia MediaType = "track"
	AlbumMedia MediaType = "album"
)

// A Media interface that both Album and Track must implement. T
// The single class method is somewhat of a dummy method, since we only want the inheritance behavior but never use this method.
// The inheritance behavior enables a search query to the media search endpoint to return a list of both albums and tracks.

type Media interface {
	GetMediaType() MediaType
}

type Album struct {
	Media       MediaType
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	ReleaseDate time.Time `json:"release_date"`
	Cover       string    `json:"cover"`
	Country     string    `json:"country"`
	GenreID     int       `json:"genre_id"`
}

type Track struct {
	Media       MediaType
	ID          int       `json:"id"`
	AlbumID     int       `json:"album_id"`
	Title       string    `json:"title"`
	Duration    int       `json:"duration_seconds"`
	ReleaseDate time.Time `json:"release_date"`
	Cover       string    `json:"cover"`
}

func (a Album) GetMediaType() MediaType {
	return a.Media
}

func (t Track) GetMediaType() MediaType {
	return t.Media
}
