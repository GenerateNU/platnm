package models

import "time"

type Recommendation struct {
	ID                  int       `json:"id"`
	MediaType           MediaType `json:"media_type"`
	MediaID             string    `json:"media_id"`
	Title               string    `json:"title"`
	ArtistName          string    `json:"artist_name"`
	Cover               string    `json:"cover"`
	RecommendeeId       string    `json:"recommendee_id"`
	RecommenderId       string    `json:"recommender_id"`
	RecommenderUsername string    `json:"recommender_username"`
	RecommenderName     string    `json:"recommender_name"`
	RecommenderPicture  string    `json:"recommender_picture"`
	Reaction            *bool     `json:"reaction"`
	CreatedAt           time.Time `json:"created_at"`
}
