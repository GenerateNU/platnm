ALTER TABLE track ADD COLUMN spotify_id TEXT UNIQUE;
ALTER TABLE track ADD COLUMN isrc TEXT UNIQUE; -- International Standard Recording Code
