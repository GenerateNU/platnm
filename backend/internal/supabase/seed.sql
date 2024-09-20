INSERT INTO users (user_id, first_name, last_name, email, phone, profile_picture)
VALUES
  ('user1', 'John', 'Smith', 'john.smith@example.com', '123-456-7890', NULL),
  ('user2', 'Jane', 'Doe', 'jane.doe@example.com', '987-654-3210', NULL),
  ('user3', 'Bob', 'Johnson', 'bob.johnson@example.com', NULL, NULL, NULL),
  ('user4', 'Emily', 'Garcia', 'emily.garcia@example.com', '555-1212', NULL)
;

INSERT INTO review (user_id, media_type, media_id, rating, description, created_at, updated_at)
VALUES 
('user123', 'album', 'album123', '4.5', 'Great album, enjoyed every track!', '2023-09-19 14:45:00', '2023-09-19 14:45:00'),
('user456', 'track', 'track789', '3.0', 'Not my taste, but decent production.', '2023-09-19 15:00:00', '2023-09-19 15:00:00'),
('user789', 'album', 'album456', '5.0', 'Absolutely fantastic! Best album of the year.', '2023-09-20 08:30:00', '2023-09-20 08:30:00'),
('user101', 'track', 'track654', '4.0', NULL, '2023-09-20 09:45:00', '2023-09-20 09:45:00');
