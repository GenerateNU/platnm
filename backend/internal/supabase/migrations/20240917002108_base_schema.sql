create table if not exists "user" (
    id uuid primary key default uuid_generate_v4(),
    username text not null unique,
    display_name text not null,
    bio text,
    profile_picture text,
    linked_account text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table if not exists artist (
    id bigserial primary key,
    name text not null,
    photo text,
    bio text
);

create table if not exists genre (
    id serial primary key,
    name text not null
);

create table if not exists album (
    id bigserial primary key,
    title text not null,
    release_date date not null,
    cover text,
    country text,
    genre_id integer references genre(id)
);

create table if not exists album_artist (
    album_id bigint references album(id),
    artist_id bigint references artist(id),
    primary key (album_id, artist_id)
);

create table if not exists track (
    id bigserial primary key,
    album_id bigint not null references album(id),
    title text not null,
    duration_seconds int not null
);

create table if not exists track_artist (
    track_id bigint not null references track(id),
    artist_id bigint not null references artist(id),
    primary key (track_id, artist_id)
);

create type media_type as enum ('album', 'track');

create table if not exists review (
    id serial primary key,
    user_id uuid not null references "user"(id),
    media_id integer not null, -- can't foreign key to album or track because it could be either
    media_type media_type not null,
    rating int not null,
    comment text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
    add constraint unique_user_media unique (user_id, media_id);
);