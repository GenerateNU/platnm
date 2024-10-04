package models

import "time"

type Recommendation struct {
	ID            int       `json:"id"`
	MediaType     string    `json:"media_type"`
	MediaID       string    `json:"media_id"`
	RecommendeeId string    `json:"recommendee_id"`
	RecommenderId string    `json:"recommender_id"`
	Reaction      bool      `json:"reaction"`
	CreatedAt     time.Time `json:"created_at"`
}
