package schema

import (
	"context"
	"fmt"
	"platnm/internal/models"

	"platnm/internal/errs"

	"github.com/jackc/pgx/v5/pgxpool"
)

type VoteRepository struct {
	db *pgxpool.Pool
}
const (
	userVoteFKeyConstraint   = "review_user_id_fkey"
	votePKeyConstraint = "user_review_vote_pkey"
	reviewFKeyConstraint = "user_review_vote_review_id_fkey"
)

func (r *VoteRepository) AddVote(ctx context.Context, vote *models.UserReviewVote) (error) {
	query := `
	INSERT INTO user_review_vote (user_id, review_id, upvote)
	VALUES ($1, $2, $3);
	`

	_, err := r.db.Exec(ctx, query, vote.UserID, vote.ReviewID, vote.Upvote) 
	if err != nil {
		if errs.IsUniqueViolation(err, votePKeyConstraint) {
			return errs.Conflict("user_review_vote", "(user_id, review_id)", fmt.Sprintf("(%s, %d)", vote.UserID, vote.ReviewID))
		} else if errs.IsForeignKeyViolation(err, userVoteFKeyConstraint) {
			return errs.NotFound("user_review_vote", "UserID", vote.UserID)
		} else if errs.IsForeignKeyViolation(err, reviewFKeyConstraint) {
			return errs.NotFound("user_review_vote", "ReviewID", vote.ReviewID)
		}
		return err
	}
	return nil
}

func (r *VoteRepository) GetVoteIfExists(ctx context.Context, usrID string, revID string) (*models.UserReviewVote, error) {
	var voteHolder models.UserReviewVote
	err := r.db.QueryRow(ctx, `SELECT user_id, review_id, upvote FROM user_review_vote WHERE user_id = $1 AND review_id = $2`, usrID, revID).Scan(&voteHolder.UserID, &voteHolder.ReviewID, &voteHolder.Upvote)
	if err != nil {
		return nil, err
	}
	return &voteHolder, nil
}

func (r *VoteRepository) DeleteVote(ctx context.Context, userID string, revID string) (error) {
	query := `
	DELETE FROM user_review_vote 
	WHERE user_id = $1 AND review_id =$2
	`
	_, err := r.db.Exec(ctx, query, userID, revID)
	if err != nil {
		return err
	}
	return nil
}

func (r *VoteRepository) UpdateVote(ctx context.Context, userID string, reviewID string, vote bool) (error) {
	query := `
	UPDATE user_review_vote
	SET upvote = $1
	WHERE user_id = $2 AND review_id = $3
	`
	_, err := r.db.Exec(ctx, query, vote, userID, reviewID)
	if err != nil {
		return err
	}
	return nil
}

func NewVoteRepository(db *pgxpool.Pool) *VoteRepository {
	return &VoteRepository{
		db,
	}
}