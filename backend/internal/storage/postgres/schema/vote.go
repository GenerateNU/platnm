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
	userVoteFKeyConstraint = "review_user_id_fkey"
	votePKeyConstraint     = "user_vote_pkey"
	reviewFKeyConstraint   = "user_vote_id_fkey"
)

func (r *VoteRepository) AddVote(ctx context.Context, vote *models.UserVote, postType string) error {
	query := `
	INSERT INTO user_vote (user_id, post_id, upvote, post_type)
	VALUES ($1, $2, $3, $4);
	`

	_, err := r.db.Exec(ctx, query, vote.UserID, vote.PostID, vote.Upvote, postType)
	if err != nil {
		if errs.IsUniqueViolation(err, votePKeyConstraint) {
			return errs.Conflict("user_vote", "(user_id, post_id)", fmt.Sprintf("(%s, %s)", vote.UserID, vote.PostID))
		} else if errs.IsForeignKeyViolation(err, userVoteFKeyConstraint) {
			return errs.NotFound("user_vote", "UserID", vote.UserID)
		} else if errs.IsForeignKeyViolation(err, reviewFKeyConstraint) {
			return errs.NotFound("user_vote", "PostID", vote.PostID)
		}
		return err
	}
	return nil
}

func (r *VoteRepository) GetVoteIfExists(ctx context.Context, usrID string, revID string, postType string) (*models.UserVote, error) {
	var voteHolder models.UserVote

	err := r.db.QueryRow(ctx, `SELECT user_id, post_id, upvote, post_type FROM user_vote WHERE user_id = $1 AND post_id = $2 AND post_type = $3`, usrID, revID, postType).Scan(&voteHolder.UserID, &voteHolder.PostID, &voteHolder.Upvote, &voteHolder.PostType)
	if err != nil {
		if err.Error() == "no rows in result set" {
			return nil, nil
		}
		return nil, err
	}

	return &voteHolder, nil
}

func (r *VoteRepository) DeleteVote(ctx context.Context, userID string, revID string, postType string) error {
	query := `
	DELETE FROM user_vote 
	WHERE user_id = $1 AND post_id =$2 AND post_type = $3
	`
	_, err := r.db.Exec(ctx, query, userID, revID, postType)
	if err != nil {
		return err
	}
	return nil
}

func (r *VoteRepository) UpdateVote(ctx context.Context, userID string, reviewID string, vote bool, postType string) error {
	query := `
	UPDATE user_vote
	SET upvote = $1
	WHERE user_id = $2 AND post_id = $3 AND post_type = $4
	`
	_, err := r.db.Exec(ctx, query, vote, userID, reviewID, postType)
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
