create table if not exists "user" (
    id uuid primary key default uuid_generate_v4(),
    username text not null,
    display_name text not null,
    bio text,
    profile_picture text,
    linked_account text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table if not exists artist (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    photo text,
    bio text
);

create table if not exists genre (
    id uuid primary key default uuid_generate_v4(),
    name text not null
);

create table if not exists album (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    release_date date not null,
    cover text,
    country text,
    genre_id uuid references genre(id)
);

create table if not exists album_artist (
    album_id uuid references album(id),
    artist_id uuid references artist(id),
    primary key (album_id, artist_id)
);

create table if not exists track (
    id uuid primary key default uuid_generate_v4(),
    album_id uuid references album(id),
    artist_id uuid references artist(id),
    title text not null,
    duration_seconds int not null
);

create table if not exists track_artist (
    track_id uuid references track(id),
    artist_id uuid references artist(id),
    primary key (track_id, artist_id)
);

create type media_type as enum ('album', 'track');

create table if not exists review (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references "user"(id),
    media_id uuid not null, -- can't foreign key to album or track because it could be either
    media_type media_type not null,
    rating int not null,
    comment text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);