INSERT INTO "user" (id, username, display_name, bio, profile_picture, linked_account, created_at, updated_at)
VALUES
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'john_doe', 'John Doe', 'Software developer from New York.', 'https://example.com/profiles/john_doe.jpg', 'john_doe_linked', now(), now()),
  ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'jane_smith', 'Jane Smith', 'Graphic designer from California.', 'https://example.com/profiles/jane_smith.jpg', 'jane_smith_linked', now(), now()),
  ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'alice_jones', 'Alice Jones', 'Content writer from Texas.', 'https://example.com/profiles/alice_jones.jpg', 'alice_jones_linked', now(), now()),
  ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9d', 'bob_brown', 'Bob Brown', 'Digital marketer from Florida.', 'https://example.com/profiles/bob_brown.jpg', 'bob_brown_linked', now(), now()),
  ('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9d0e', 'charlie_davis', 'Charlie Davis', 'SEO specialist from Washington.', 'https://example.com/profiles/charlie_davis.jpg', 'charlie_davis_linked', now(), now());

INSERT INTO artist (name, photo, bio)
VALUES
  ('The Beatles', 'https://upload.wikimedia.org/wikipedia/commons/1/1d/The_Fabs.JPG', 'The Beatles were an English rock band formed in Liverpool in 1960. With a line-up comprising John Lennon, Paul McCartney, George Harrison and Ringo Starr, they are regarded as the most influential band of all time.'),
  ('The Rolling Stones', 'https://upload.wikimedia.org/wikipedia/commons/2/2c/RollingStones-01.jpg', 'The Rolling Stones are an English rock band formed in London in 1962. The first stable line-up consisted of bandleader Brian Jones (guitar, harmonica, keyboards), Mick Jagger (lead vocals, harmonica), Keith Richards (guitar, vocals), Bill Wyman (bass guitar), Charlie Watts (drums), and Ian Stewart (piano).'),
  ('Taylor Swift', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_4.png/220px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_4.png', 'Taylor Alison Swift is an American singer-songwriter. Known for her autobiographical songwriting, artistic reinventions, and cultural impact, Swift is a leading figure in popular music and the subject of widespread public interest.');

INSERT INTO genre (name)
VALUES
  ('Rock'),
  ('Pop');

INSERT INTO album (title, release_date, cover, country, genre_id)
VALUES
  ('Abbey Road', '1969-09-26', 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg', 'United Kingdom', 1),
  ('Sticky Fingers', '1971-04-23', 'https://upload.wikimedia.org/wikipedia/en/3/38/Stickyfingersalbumcover.jpg', 'United Kingdom', 1),
  ('1989 (Taylor''s Version)', '2023-10-27', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png', 'United States', 2);

INSERT INTO album_artist (album_id, artist_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 3);

INSERT INTO track (album_id, title, duration_seconds)
VALUES
  (1, 'Come Together', 248),
  (1, 'Something', 182),
  (2, 'Brown Sugar', 212),
  (2, 'Wild Horses', 342),
  (3, 'Wonderland (Taylor''s Version)', 365);


INSERT INTO track_artist (track_id, artist_id)
VALUES
  (1, 1),
  (2, 1),
  (3, 2),
  (4, 2),
  (5, 3);

INSERT INTO review (user_id, media_id, media_type, rating, comment)
VALUES
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 1, 'album', 5, 'This is a great album!'),
  ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 2, 'album', 4, 'I like this album.'),
  ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 1, 'track', 3, 'This song is okay.'),
  ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9d', 3, 'track', 2, 'I don''t like this song.'),
  ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9d', 5, 'track', 2, 'This song is the best song ever');