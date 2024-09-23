package reviews

import "platnm/internal/storage"

type ReviewHandler struct {
	reviewRepository storage.ReviewRepository
	userRepository storage.UserRepository
}

func NewReviewHandler(reviewRepository storage.ReviewRepository, userRepository storage.UserRepository) *ReviewHandler {
	return &ReviewHandler{
		reviewRepository,
		userRepository,
	}
}
