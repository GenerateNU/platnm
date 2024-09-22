package config

type Application struct {
	Port     string `env:"PORT, default=8080"`      // the port for the server to listen on
	LogLevel string `env:"LOG_LEVEL, default=INFO"` // the level of event to log
}
