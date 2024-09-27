package config

type Spotify struct {
	RedirectURI  string `env:"SPOTIFY_REDIRECT_URI, required"`
	ClientID     string `env:"SPOTIFY_ID, required"`
	ClientSecret string `env:"SPOTIFY_SECRET, required"`
}
