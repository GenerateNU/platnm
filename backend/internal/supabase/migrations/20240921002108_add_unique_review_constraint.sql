-- btw if query fails due to unique constraint, review.id will still be incremented
alter table review add constraint unique_user_media unique (user_id, media_id, media_type);
