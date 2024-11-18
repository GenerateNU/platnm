CREATE TABLE section_item (
    id serial primary key,
    title text not null,
    cover_photo text NOT NULL
);

CREATE TABLE section_type (
    id serial primary key,
    title text not null,
    search_type text NOT NULL
);

CREATE TABLE section_type_item (
    user_id uuid not null references "user"(id),
    section_item_id integer not null references section_item(id),
    section_type_id integer not null references section_type(id),
    primary key (section_item_id, section_type_id, user_id)
);
