package platnm

import (
	"platnm/internal/config"
	"platnm/internal/service/handler/oauth"
)

type Handler struct {
	store  *oauth.StateStore
	config config.Supabase
}

func NewHandler(store *oauth.StateStore, config config.Supabase) *Handler {
	return &Handler{
		store:  store,
		config: config,
	}
}
