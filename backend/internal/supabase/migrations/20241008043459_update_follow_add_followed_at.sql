ALTER TABLE follower
ADD COLUMN followed_at timestamp with time zone default now() not null;

UPDATE follower
SET followed_at = CURRENT_TIMESTAMP
WHERE followed_at IS NULL;