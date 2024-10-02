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

// names dont get much better than this
type MediaWithReviewCountAndType struct {
	Media Media     `json:"media"`
	Count int       `json:"review_count"`
	Type  MediaType `json:"type"`
}

type Album struct {
	ID          int       `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	ReleaseDate time.Time `json:"release_date" db:"release_date"`
	Cover       string    `json:"cover" db:"cover"`
	Country     string    `json:"country" db:"country"`
	GenreID     int       `json:"genre_id" db:"genre_id"`
}

type Track struct {
	ID          int       `json:"id" db:"id"`
	AlbumID     int       `json:"album_id" db:"album_id"`
	AlbumTitle  string    `json:"album_title" db:"-"`
	Title       string    `json:"title" db:"title"`
	Duration    int       `json:"duration_seconds" db:"duration_seconds"`
	ReleaseDate time.Time `json:"release_date" db:"-"`
	Cover       string    `json:"cover" db:"-"`
}

func (a Album) GetMediaType() MediaType {
	return AlbumMedia
}

func (t Track) GetMediaType() MediaType {
	return TrackMedia
}
