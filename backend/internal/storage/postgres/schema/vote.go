package schema

import (
	"context"
	"fmt"
	"platnm/internal/models"

	"platnm/internal/errs"

	"github.com/jackc/pgx/v5"
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

func (r *VoteRepository) AddVote(ctx context.Context, vote *models.UserReviewVote) (*models.UserReviewVote, error) {
	query := `
	INSERT INTO user_review_vote (user_id, review_id, upvote)
	VALUES ($1, $2, $3);
	`

	if err := r.QueryRow(ctx, query, user_review_vote.UserID, user_review_vote.ReviewID, user_review_vote.Upvote).Scan(&user_review_vote.user_id); err != nil {
		if errs.IsUniqueViolation(err, votePKeyConstraint) {
			return nil, errs.Conflict("user_review_vote", "(user_id, review_id)", fmt.Sprintf("(%s, %d)", user_review_vote.UserID, user_review_vote.ReviewID))
		} else if errs.IsForeignKeyViolation(err, userVoteFKeyConstraint) {
			return nil, errs.NotFound("user_review_vote", "UserID", user_review_vote.UserID)
		} else if errs.IsForeignKeyViolation(err, reviewFKeyConstraint) {
			return nil, errs.NotFound("user_review_vote", "ReviewID", user_review_vote.ReviewID)
		}

		return nil, err
	}
	return review, nil
}

func (r *VoteRepository) GetVoteIfExists(ctx context.Context, usrID string, revID string) (bool, bool, error) {
	//Should I use this var to return upvote value instead of making helper func
	var upVoteValue bool
	row, err := r.Query(ctx, `SELECT upvote FROM user_review_vote WHERE user_id = $1 AND review_id = $2`, usrID, revID)
	if err != nil {
		return false, false, err
	}
	if rows.Next() {
		err := rows.Scan(&upVoteValue)
		if err != nil {
			return false, false, err
		}
		return true, upVoteValue, nil
	} else {
		return false, false, nil
	}
}

func (r *VoteRepository) DeleteVote(ctx context.Context, userID string, revID string) (error) {
	query := `
	DELETE FROM user_review_vote 
	WHERE userID = $1 AND revID =$2
	`
	_, err := r.db.ExecContext(ctx, query, userID, revID)
	if err != nil {
		return err
	}
	return nil
}

func (r *VoteRepository) UpdateVote(ctx context.Context, userID string, reviewID string, vote bool) (error) {
	query = `
	UPDATE user_review_vote
	SET upvote = $1
	WHERE user_id = $2 AND review_id = $3
	`
	_, err := r.db.ExecContext(ctx, query, vote, userID, reviewID)
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