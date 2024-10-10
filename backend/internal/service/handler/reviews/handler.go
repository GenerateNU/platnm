package reviews

import "platnm/internal/storage"

type Handler struct {
	reviewRepository storage.ReviewRepository
	userRepository   storage.UserRepository
	voteRepository   storage.VoteRepository
}

func NewHandler(reviewRepository storage.ReviewRepository, userRepository storage.UserRepository, voteRepository storage.VoteRepository) *Handler {
	return &Handler{
		reviewRepository,
		userRepository,
		voteRepository,
	}
}
