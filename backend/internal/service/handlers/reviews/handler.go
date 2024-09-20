package reviews

import "platnm/internal/storage"

type Handler struct {
	reviewRepository storage.ReviewRepository
}

func NewHandler(reviewRepository storage.ReviewRepository) *Handler {
	return &Handler{
		reviewRepository,
	}
}
