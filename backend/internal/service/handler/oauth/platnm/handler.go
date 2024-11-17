package platnm

import (
	"platnm/internal/config"
	"platnm/internal/service/session"
)

type Handler struct {
	store  *session.SessionStore
	config config.Supabase
}

func NewHandler(store *session.SessionStore, config config.Supabase) *Handler {
	return &Handler{
		store:  store,
		config: config,
	}
}