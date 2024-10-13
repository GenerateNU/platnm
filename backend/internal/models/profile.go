package models

type Profile struct {
	UserID    string `json:"user_id"`
	Username  string `json:"username"`
	Bio       string `json:"bio"`
	Score     int    `json:"score"`
	Followers int    `json:"followers"`
	Followed  int    `json:"followed"`
}
