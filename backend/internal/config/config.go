package config

type Config struct {
	DbHost         string `env:"DB_HOST, required"`          // the database host to connect to
	DbPort         string `env:"DB_PORT, required"`          // the database port to connect to
	DbUser         string `env:"DB_USER, required"`          // the user to connect to the database with
	DbPassword     string `env:"DB_PASSWORD, required"`      // the password to connect to the database with
	DbName         string `env:"DB_NAME, required"`          // the name of the database to connect to
	SpClientKey    string `env:"SP_CLIENT_KEY, required"`    // the client key for the spotify api
	SpClientSecret string `env:"SP_CLIENT_SECRET, required"` // the client secret for the spotify api

	Port     string `env:"PORT, default=8080"`      // the port for the server to listen on
	LogLevel string `env:"LOG_LEVEL, default=INFO"` // the level of event to log
}
