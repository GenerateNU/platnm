CREATE TABLE albums (
  id   BIGSERIAL PRIMARY KEY,
  name text      NOT NULL,
  bio  text
);

CREATE TABLE test (
  id number PRIMARY KEY,
  created_at timestamp
);