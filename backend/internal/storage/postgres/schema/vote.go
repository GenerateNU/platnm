package schema

import (
	"context"
	"errors"
	"fmt"
	"platnm/internal/models"

	"platnm/internal/errs"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VoteRepository struct {
	*pgxpool.Pool
}
//Don't think this is relevant??
const (
	userFKeyConstraint   = "review_user_id_fkey"
	votePKeyConstraint = "user_review_vote_pkey"
	reviewFKeyConstraint = "user_review_vote_review_id_fkey"
)
//Query doesn't work  -- same as create review
func (r *VoteRepository) AddVote(ctx context.Context, vote *models.UserReviewVote) (*models.UserReviewVote, error) {
	query := `
	INSERT INTO user_review_vote (user_id, review_id, upvote)
	VALUES ($1, $2, $3);
	`

	if err := r.QueryRow(ctx, query, user_review_vote.UserID, user_review_vote.ReviewID, user_review_vote.Upvote).Scan(&user_review_vote.user_id); err != nil {
		if errs.IsUniqueViolation(err, votePKeyConstraint) {
			return nil, errs.Conflict("user_review_vote", "(user_id, review_id)", fmt.Sprintf("(%s, %d)", user_review_vote.UserID, user_review_vote.ReviewID))
		} else if errs.IsForeignKeyViolation(err, userFKeyConstraint) {
			return nil, errs.NotFound("user_review_vote", "UserID", user_review_vote.UserID)
		} else if errs.IsForeignKeyViolation(err, reviewFKeyConstraint) {
			return nil, errs.NotFound("user_review_vote", "ReviewID", user_review_vote.ReviewID)
		}

		return nil, err
	}
	return review, nil
}

func NewVoteRepository(db *pgxpool.Pool) *VoteRepository {
	return &VoteRepository{
		db,
	}
}