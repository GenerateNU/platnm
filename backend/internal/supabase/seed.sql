INSERT INTO users (user_id, first_name, last_name, email, phone, profile_picture)
VALUES
  ('user1', 'John', 'Smith', 'john.smith@example.com', '123-456-7890', NULL),
  ('user2', 'Jane', 'Doe', 'jane.doe@example.com', '987-654-3210', NULL),
  ('user3', 'Bob', 'Johnson', 'bob.johnson@example.com', NULL, NULL),
  ('user4', 'Emily', 'Garcia', 'emily.garcia@example.com', '555-1212', NULL);

INSERT INTO "user" (id, username, display_name, bio, profile_picture, linked_account, created_at, updated_at)
VALUES
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'john_doe', 'John Doe', 'Software developer from New York.', 'https://example.com/profiles/john_doe.jpg', 'john_doe_linked', now(), now()),
  ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'jane_smith', 'Jane Smith', 'Graphic designer from California.', 'https://example.com/profiles/jane_smith.jpg', 'jane_smith_linked', now(), now()),
  ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'alice_jones', 'Alice Jones', 'Content writer from Texas.', 'https://example.com/profiles/alice_jones.jpg', 'alice_jones_linked', now(), now()),
  ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'bob_brown', 'Bob Brown', 'Digital marketer from Florida.', 'https://example.com/profiles/bob_brown.jpg', 'bob_brown_linked', now(), now()),
  ('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9c0d', 'charlie_davis', 'Charlie Davis', 'SEO specialist from Washington.', 'https://example.com/profiles/charlie_davis.jpg', 'charlie_davis_linked', now(), now());

INSERT INTO artist (id, name, photo, bio)
VALUES
  ('3d6f0b8e-1c4b-4b8e-8f8e-1c4b4b8e8f8e', 'The Beatles', 'https://upload.wikimedia.org/wikipedia/commons/1/1d/The_Fabs.JPG', 'The Beatles were an English rock band formed in Liverpool in 1960. With a line-up comprising John Lennon, Paul McCartney, George Harrison and Ringo Starr, they are regarded as the most influential band of all time.'),
  ('4e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d', 'The Rolling Stones', 'https://upload.wikimedia.org/wikipedia/commons/2/2c/RollingStones-01.jpg', 'The Rolling Stones are an English rock band formed in London in 1962. The first stable line-up consisted of bandleader Brian Jones (guitar, harmonica, keyboards), Mick Jagger (lead vocals, harmonica), Keith Richards (guitar, vocals), Bill Wyman (bass guitar), Charlie Watts (drums), and Ian Stewart (piano).');

INSERT INTO genre (id, name)
VALUES
  ('0e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d', 'Rock'),
  ('1f8e2d6e-3e6d-6d9e-af9e-3e6d6d9eaf9e', 'Pop');

INSERT INTO album (id, title, release_date, cover, country, genre_id)
VALUES
  ('5f9e3d7e-4f7e-7e9e-bf9e-4f7e7e9ebf9e', 'Abbey Road', '1969-09-26', 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg', 'United Kingdom', '0e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d'),
  ('6f0e4d8e-5f8e-8e9e-cf9e-5f8e8e9ecf9e', 'Sticky Fingers', '1971-04-23', 'https://upload.wikimedia.org/wikipedia/en/3/38/Stickyfingersalbumcover.jpg', 'United Kingdom', '0e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d');

INSERT INTO album_artist (album_id, artist_id)
VALUES
  ('5f9e3d7e-4f7e-7e9e-bf9e-4f7e7e9ebf9e', '3d6f0b8e-1c4b-4b8e-8f8e-1c4b4b8e8f8e'),
  ('6f0e4d8e-5f8e-8e9e-cf9e-5f8e8e9ecf9e', '4e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d');

INSERT INTO track (id, album_id, artist_id, title, duration_seconds)
VALUES
  ('7f1e5d9e-6f9e-9e9e-df9e-6f9e9e9edf9e', '5f9e3d7e-4f7e-7e9e-bf9e-4f7e7e9ebf9e', '3d6f0b8e-1c4b-4b8e-8f8e-1c4b4b8e8f8e', 'Come Together', 248),
  ('8f2e6d0e-7f0e-0e9e-ef9e-7f0e0e9eef9e', '5f9e3d7e-4f7e-7e9e-bf9e-4f7e7e9ebf9e', '3d6f0b8e-1c4b-4b8e-8f8e-1c4b4b8e8f8e', 'Something', 182),
  ('9f3e7d1e-8f1e-1e9e-ff9e-8f1e1e9eff9e', '6f0e4d8e-5f8e-8e9e-cf9e-5f8e8e9ecf9e', '4e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d', 'Brown Sugar', 212),
  ('af4e8d2e-9f2e-2e9e-0f9e-9f2e2e9e0f9e', '6f0e4d8e-5f8e-8e9e-cf9e-5f8e8e9ecf9e', '4e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d', 'Wild Horses', 342);

INSERT INTO track_artist (track_id, artist_id)
VALUES
  ('7f1e5d9e-6f9e-9e9e-df9e-6f9e9e9edf9e', '3d6f0b8e-1c4b-4b8e-8f8e-1c4b4b8e8f8e'),
  ('8f2e6d0e-7f0e-0e9e-ef9e-7f0e0e9eef9e', '3d6f0b8e-1c4b-4b8e-8f8e-1c4b4b8e8f8e'),
  ('9f3e7d1e-8f1e-1e9e-ff9e-8f1e1e9eff9e', '4e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d'),
  ('af4e8d2e-9f2e-2e9e-0f9e-9f2e2e9e0f9e', '4e7f1c9d-2d5c-5c9d-9f9d-2d5c5c9d9f9d');

INSERT INTO review (id, user_id, media_id, media_type, rating, comment)
VALUES
  ('bf5e9d3e-af3e-3e9e-1f9e-af3e3e9e1f9e', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '5f9e3d7e-4f7e-7e9e-bf9e-4f7e7e9ebf9e', 'album', 5, 'This is a great album!'),
  ('df7e1d5e-cf5e-5e9e-3f9e-cf5e5e9e3f9e', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', '6f0e4d8e-5f8e-8e9e-cf9e-5f8e8e9ecf9e', 'album', 4, 'I like this album.'),
  ('ff9e3d7e-ef7e-7e9e-5f9e-ef7e7e9e5f9e', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', '7f1e5d9e-6f9e-9e9e-df9e-6f9e9e9edf9e', 'track', 3, 'This song is okay.'),
  ('1f1e5d9e-1f9e-9e9e-7f9e-1f9e9e9e7f9e', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', '9f3e7d1e-8f1e-1e9e-ff9e-8f1e1e9eff9e', 'track', 2, 'I don''t like this song.');