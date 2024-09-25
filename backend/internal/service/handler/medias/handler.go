package medias

import "platnm/internal/storage"


type Handler struct {
	mediaRepository storage.MediaRepository
}

func NewHandler(mediaRepository storage.MediaRepository) *Handler {
	return &Handler{
		mediaRepository,
	}
}
