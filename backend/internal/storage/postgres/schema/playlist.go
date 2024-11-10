package schema

import (
	"context"
	"fmt"
	"platnm/internal/errs"
	"platnm/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PlaylistRepository struct {
	*pgxpool.Pool
}

const (
	playlistTrackFKeyConstraint = "playlist_track_track_id_fkey"
)

func (r *PlaylistRepository) CreatePlaylist(ctx context.Context, playlist models.Playlist) error {

	query := `
	INSERT INTO playlist (title, user_id, bio, cover_photo)
	VALUES ($1, $2, $3, $4);
	`

	_, err := r.Exec(ctx, query, playlist.Title, playlist.UserID, playlist.Bio, playlist.CoverPhoto)

	if err != nil {
		return err
	}
	return nil

}

func (r *PlaylistRepository) AddToUserOnQueue(ctx context.Context, id string, track models.Track) error {

	var playlistID string

	findQuery := `SELECT id FROM playlist WHERE user_id = $1 AND title = 'On Queue'`
	err := r.QueryRow(ctx, findQuery, id).Scan(&playlistID)

	if err != nil {
		return err
	}

	// now insert the track into the user's on queue playlist
	insertQuery := `
	INSERT INTO playlist_track (playlist_id, track_id)
	VALUES ($1, $2);
	`
	if _, err = r.Exec(ctx, insertQuery, playlistID, track.ID); err != nil {
		if errs.IsForeignKeyViolation(err, playlistTrackFKeyConstraint) {
			return errs.NotFound("track", "id", track.ID)
		}
	} else {
		return err
	}

	return nil

}

func (r *PlaylistRepository) GetUserOnQueue(ctx context.Context, id string) ([]*models.OnQueueData, error) {
	fmt.Print("id", id)

	var onQueuePlaylist []*models.OnQueueData

	findQuery := `
        SELECT track.id, track.title, artist.name
        FROM track
        JOIN playlist_track ON track.id = playlist_track.track_id
        JOIN playlist ON playlist_track.playlist_id = playlist.id
        JOIN track_artist ON track.id = track_artist.track_id
        JOIN artist ON track_artist.artist_id = artist.id
        WHERE user_id = $1
        AND playlist.title = 'On Queue'`

	rows, err := r.Query(ctx, findQuery, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var data models.OnQueueData
		if err := rows.Scan(&data.TrackId, &data.TrackTitle, &data.ArtistName); err != nil {
			return nil, err
		}
		onQueuePlaylist = append(onQueuePlaylist, &data)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	fmt.Println("onQueuePlaylist", onQueuePlaylist)

	return onQueuePlaylist, nil
}

func NewPlaylistRepository(db *pgxpool.Pool) *PlaylistRepository {
	return &PlaylistRepository{
		db,
	}
}
