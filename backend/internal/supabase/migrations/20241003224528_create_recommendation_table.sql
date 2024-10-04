CREATE TABLE IF NOT EXISTS recommendation (
    id SERIAL PRIMARY KEY,
    media_id int NOT NULL,
    media_type media_type NOT NULL,
    recommender_id UUID NOT NULL,
    recommendee_id UUID NOT NULL,
    created_at timestamp with time zone default now(),
    reaction BOOLEAN,
    CONSTRAINT fk_recommender FOREIGN KEY (recommender_id) REFERENCES "user"(id),
    CONSTRAINT fk_recommendee FOREIGN KEY (recommendee_id) REFERENCES "user"(id)
);