package models

type Artist struct {
	ID        int    `json:"id"`
	SpotifyID string `json:"spotify_id"`
	Name      string `json:"name"`
	Photo     string `json:"photo"`
	Bio       string `json:"bio"`
}
