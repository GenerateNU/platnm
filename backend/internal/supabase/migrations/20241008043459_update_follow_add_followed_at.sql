ALTER TABLE follower
ADD COLUMN followed_at timestamp with time zone default now() not null;
