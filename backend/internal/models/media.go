package models

import "time"

type MediaType string

const (
	TrackMedia MediaType = "track"
	AlbumMedia MediaType = "album"
)

type Media interface {
	GetID() int
	GetTitle() string
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
	Media    MediaType
	ID       int    `json:"id"`
	AlbumID  int    `json:"album_id"`
	Title    string `json:"title"`
	Duration int    `json:"duration_seconds"`
}

func (a Album) GetID() int {
	return a.ID
}

func (a Album) GetTitle() string {
	return a.Title
}

func (a Album) GetMediaType() MediaType {
	return a.Media
}

func (t Track) GetID() int {
	return t.ID
}

func (t Track) GetTitle() string {
	return t.Title
}

func (t Track) GetMediaType() MediaType {
	return t.Media
}
