create table if not exists follower (
    follower_id uuid not null references "user"(id),
    followee_id uuid not null references "user"(id),
    primary key (follower_id, followee_id)
);

create table if not exists playlist (
    id serial primary key,
    title text not null,
    user_id uuid not null references "user"(id),
    bio text,
    cover_photo text
);

create table if not exists playlist_track (
    playlist_id bigint not null references playlist(id),
    track_id bigint not null references track(id),
    primary key (playlist_id, track_id)
);

create table if not exists user_auth (
    id serial primary key,
    user_id uuid not null references "user"(id),
    refresh_token text not null,
    access_token text not null
);

create table if not exists user_review_vote (
    user_id uuid not null references "user"(id),
    review_id integer not null references review(id),
    upvote boolean not null,
    primary key (user_id, review_id)
);