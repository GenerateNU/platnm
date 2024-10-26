ALTER TABLE user_auth 
ADD COLUMN expiry TIMESTAMP;

ALTER TABLE user_auth
ADD COLUMN token_type TEXT;

ALTER TABLE user_auth
ADD CONSTRAINT user_auth_user_id_unique UNIQUE (user_id);