package playlist

import "platnm/internal/storage"

type Handler struct {
	playlistRepository storage.PlaylistRepository
}

func NewHandler(playlistRepository storage.PlaylistRepository) *Handler {
	return &Handler{
		playlistRepository,
	}
}
