package models

type Playlist struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	UserID     string `json:"user_id"`
	Bio        string `json:"bio"`
	CoverPhoto string `json:"cover_photo"`
}

type OnQueueData struct {
	TrackId    string `json:"id"`
	TrackTitle string `json:"title"`
	ArtistName string `json:"name"`
}
