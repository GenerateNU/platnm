-- Step 1: Rename the table
ALTER TABLE user_review_vote RENAME TO user_vote;

ALTER TABLE user_vote ADD COLUMN vote_id SERIAL;

ALTER TABLE user_vote DROP CONSTRAINT user_review_vote_pkey;

ALTER TABLE user_vote DROP CONSTRAINT user_review_vote_review_id_fkey;

ALTER TABLE user_vote ADD CONSTRAINT user_vote_pkey PRIMARY KEY (vote_id);


-- Step 2: Rename the column review_id to id
ALTER TABLE user_vote RENAME COLUMN review_id TO post_id;

-- Step 3: Create the enum type for post_type
create type post_type as enum ('review', 'comment');

-- Step 4: Add the post_type column with default value 'review'
ALTER TABLE user_vote ADD COLUMN post_type post_type NOT NULL DEFAULT 'review';

-- Step 5: Update the existing rows to set post_type to 'review' (if not already set by default)
UPDATE user_vote SET post_type = 'review';

-- Step 6: Remove the default value for post_type (optional, based on your requirements)
ALTER TABLE user_vote ALTER COLUMN post_type DROP DEFAULT;

ALTER TABLE comment ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
