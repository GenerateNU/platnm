create type music_enthusiasm as enum ('Occasional listener', 'Music lover', 'Expert');

ALTER TABLE "user"
ADD COLUMN enthusiasm music_enthusiasm;