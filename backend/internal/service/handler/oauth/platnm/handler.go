package platnm

import (
	"platnm/internal/config"
	"platnm/internal/service/handler/oauth"
)

type Handler struct {
	store  *oauth.UserStateStore
	config config.Supabase
}

func NewHandler(store *oauth.UserStateStore, config config.Supabase) *Handler {
	return &Handler{
		store:  store,
		config: config,
	}
}
