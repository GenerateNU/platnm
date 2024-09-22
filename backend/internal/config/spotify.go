package config

type Spotify struct {
	RedirectURI string `env:"SPOTIFY_REDIRECT_URI, required"`
}
