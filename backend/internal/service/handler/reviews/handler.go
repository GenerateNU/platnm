package reviews

import "platnm/internal/storage"


type Handler struct {
	reviewRepository storage.ReviewRepository
	userRepository storage.UserRepository
}

func NewHandler(reviewRepository storage.ReviewRepository, userRepository storage.UserRepository) *Handler {
	return &Handler{
		reviewRepository,
		userRepository,
	}
}
