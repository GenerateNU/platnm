-- delete old test table
DROP TABLE if exists "users";

-- update user table to contain platnm column
ALTER TABLE "user" ADD COLUMN platnm INT NOT NULL DEFAULT 0;