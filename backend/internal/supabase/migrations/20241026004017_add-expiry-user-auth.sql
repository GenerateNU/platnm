ALTER TABLE user_auth
    DROP COLUMN refresh_token,
    DROP COLUMN access_token,
    ADD COLUMN token text,
    ADD CONSTRAINT user_auth_user_id_unique UNIQUE (user_id);
