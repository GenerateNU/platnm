create type Enthusiasm as enum ('Occasional listener', 'Music lover', 'Expert');

ALTER TABLE "user"
ADD COLUMN enthusiasm Enthusiasm;