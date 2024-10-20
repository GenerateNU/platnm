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

INSERT INTO follower (follower_id, followee_id)
VALUES
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e'),
  ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'),
  ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d');

INSERT INTO playlist (id, title, user_id, bio, cover_photo)
VALUES
  (1, '2024', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Playlist for 2024', 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Nils_B%C3%A4ckstr%C3%B6m_Rubin_Tyumen.jpg'),
  (2, 'Movie Music', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Cinematic soundtracks and epic scores that bring the magic of movies to life.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Anolis_marmoratus%28fight%29.jpg/1280px-Anolis_marmoratus%28fight%29.jpg'),
  (3, 'Chill Vibes', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'High-energy tracks to power your workout sessions.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/FOS244.jpg/1280px-FOS244.jpg'),
  (4, 'Workout Mix', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'A collection of nostalgic hits from past decades.', 'https://upload.wikimedia.org/wikipedia/commons/b/be/High_Airmass_Spectra_%28AuxTel-Feb%29.jpg'),
  (5, 'Platnm', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9d0e', 'Playlist for the Platnm Team', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/BCJMPort2017.jpg/1920px-BCJMPort2017.jpg');

INSERT INTO playlist_track (playlist_id, track_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 3);

INSERT INTO user_auth (id, user_id, refresh_token, access_token)
VALUES
  (1, '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'refresh_token_abc123', 'access_token_xyz123'),
  (2, '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'refresh_token_def456', 'access_token_uvw456'),
  (3, '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'refresh_token_ghi789', 'access_token_rst789'),
  (4, '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9d', 'refresh_token_jkl012', 'access_token_opq012'),
  (5, '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9d0e', 'refresh_token_mno345', 'access_token_lmn345');

INSERT INTO user_review_vote (user_id, review_id, upvote)
VALUES
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 1, true),
  ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 2, false),
  ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 3, false),
  ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9d', 4, false),
  ('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9d0e', 5, true);

  INSERT INTO recommendation (
    media_id,
    media_type,
    recommender_id,
    recommendee_id) 
    VALUES
    (1, 'album', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e');

INSERT INTO "user" (id, username, display_name, bio, created_at, updated_at, enthusiasm)
VALUES
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6f', 'jack', 'Jack Ripper', 'I love music', now(), now(), 'Expert');


-- Seed data for tags TODO: UPDATE BASED ON DESIGN'S TAGS
INSERT INTO tag (name) VALUES 
('Great Sound Quality'),
('Best Lyrics'),
('Feel Good'),
('Party Vibes'),
('Chill Music');

Insert into review_tag (review_id, tag_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5);