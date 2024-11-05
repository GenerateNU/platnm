package recommendation

import "platnm/internal/storage"

type Handler struct {
	recommendationRepository storage.RecommendationRepository
	userRepository           storage.UserRepository
}

func NewHandler(recommendationRepository storage.RecommendationRepository, userRepository storage.UserRepository) *Handler {
	return &Handler{
		recommendationRepository,
		userRepository,
	}
}
