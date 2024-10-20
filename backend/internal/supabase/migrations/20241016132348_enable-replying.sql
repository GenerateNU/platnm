CREATE TABLE comment (
id SERIAL PRIMARY KEY, -- Comment ID (int4), primary key with auto-increment
text TEXT NOT NULL, -- Comment text (text), not nullable
review_id INT NOT NULL, -- Associated review ID (int4), not nullable
user_id UUID NOT NULL, -- User ID (uuid), not nullable
created_at TIME NOT NULL -- Timestamp for when the comment was created, not nullable
);

ALTER TABLE comment
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE comment
ADD CONSTRAINT fk_review
FOREIGN KEY (review_id) REFERENCES review(id);
