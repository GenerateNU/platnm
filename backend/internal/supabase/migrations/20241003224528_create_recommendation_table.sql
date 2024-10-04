CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    media_id VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    recommender_id UUID NOT NULL,
    recommendee_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reaction BOOLEAN,
    CONSTRAINT fk_recommender FOREIGN KEY (recommender_id) REFERENCES "user"(id),
    CONSTRAINT fk_recommendee FOREIGN KEY (recommendee_id) REFERENCES "user"(id)
);