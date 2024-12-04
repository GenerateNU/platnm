create type notif_type as enum ('follow', 'comment', 'upvote', 'recommendation');

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    type notif_type NOT NULL,
    created_at timestamp with time zone default now(),
    receiver_id uuid NOT NULL references "user"(id),    
    tagged_entity_id text NOT NULL,
    tagged_entity_name text NOT NULL,
    tagged_entity_type text NOT NULL,
    thumbnail_url text NOT NULL
);