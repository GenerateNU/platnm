# API Documentation

## Health Check

- **GET** `/health`
  - Returns `200 OK` if the server is running.

## Users

- **GET** `/users`
  - Retrieves all users.
- **GET** `/users/:id`
  - Retrieves a user by ID.
- **GET** `/users/profile/id/:id`
  - Retrieves a user profile by ID.
- **GET** `/users/profile/name/:name`
  - Retrieves a user profile by name.
- **POST** `/users/follow`
  - Follow or unfollow a user.
- **GET** `/users/:id/connections`
  - Retrieves user connections.
- **POST** `/users`
  - Creates a new user.
- **PATCH** `/users/bio/:id`
  - Updates user bio.
- **PUT** `/users/enthusiasm`
  - Updates user onboarding enthusiasm.
- **PATCH** `/users/pfp/:id`
  - Updates user profile picture.
- **POST** `/users/section`
  - Creates a new section.
- **POST** `/users/section/item/:userId/:sectionId`
  - Creates a new section item.
- **PATCH** `/users/section/item`
  - Updates a section item.
- **DELETE** `/users/section/item`
  - Deletes a section item.
- **DELETE** `/users/section`
  - Deletes a section.
- **GET** `/users/section/:id`
  - Retrieves user sections.
- **GET** `/users/section/options/:id`
  - Retrieves user section options.
- **GET** `/users/feed/:id`
  - Retrieves user feed.
- **GET** `/users/following/:id`
  - Retrieves users followed by the user.
- **GET** `/users/notifications/:id`
  - Retrieves user notifications.

## Reviews

- **POST** `/reviews`
  - Creates a new review.
- **PATCH** `/reviews/:id`
  - Updates a review by ID.
- **GET** `/reviews/popular`
  - Retrieves popular reviews.
- **GET** `/reviews/tags`
  - Retrieves review tags.
- **GET** `/reviews/:id`
  - Retrieves a review by ID.
- **GET** `/reviews/media/:mediaId/:userID`
  - Retrieves user reviews of media.
- **GET** `/reviews/media/:mediaId/:userID/following`
  - Retrieves user following reviews of media.
- **GET** `/reviews/user/:id`
  - Retrieves reviews by user ID.
- **GET** `/reviews/album/:id`
  - Retrieves reviews by album ID.
- **GET** `/reviews/track/:id`
  - Retrieves reviews by track ID.
- **GET** `/reviews/album/top/:id`
  - Retrieves top reviews by album ID.
- **GET** `/reviews/track/top/:id`
  - Retrieves top reviews by track ID.
- **GET** `/reviews/track/:userId/:mediaId`
  - Retrieves user review of track.
- **POST** `/reviews/comment`
  - Creates a new comment on a review.
- **POST** `/reviews/comment/vote`
  - Votes on a comment.
- **GET** `/reviews/comment/vote/:userID/:postID`
  - Retrieves user vote on a comment.
- **GET** `/reviews/comments/:reviewid`
  - Retrieves comments on a review.
- **GET** `/reviews/vote/:userID/:postID`
  - Retrieves user vote on a review.
- **POST** `/reviews/vote`
  - Votes on a review.

## Comments

- **GET** `/comments/:commentid`
  - Retrieves a comment by ID.

## Media

- **GET** `/media/:name`
  - Retrieves media by name.
- **GET** `/media/artist/:name`
  - Retrieves artist by name.
- **GET** `/media/track/:id`
  - Retrieves track by ID.
- **GET** `/media/album/:id`
  - Retrieves album by ID.
- **GET** `/media`
  - Retrieves all media.

## Recommendations

- **POST** `/recommendation`
  - Creates a new recommendation.
- **PATCH** `/recommendation/:recommendationId`
  - Reacts to a recommendation.
- **GET** `/recommendation/:recommendeeId`
  - Retrieves recommendations for a user.

## Playlist

- **POST** `/playlist/on_queue/:userId`
  - Adds to user's on queue.
- **GET** `/playlist/on_queue/:userId`
  - Retrieves user's on queue.

## Authentication

- **Route** `/auth/spotify`
  - **GET** `/begin`
    - Begins Spotify authentication.
  - **GET** `/callback`
    - Spotify authentication callback.
- **Route** `/auth/platnm`
  - **POST** `/login`
    - Logs in a user.
  - **GET** `/health`
    - Returns `200 OK` if the service is running.
  - **POST** `/forgot`
    - Initiates forgot password process.
  - **POST** `/signout`
    - Signs out a user.
  - **POST** `/deactivate`
    - Deactivates a user account.
  - **PUT** `/resetpassword`
    - Resets user password.

## Spotify

- **Route** `/spotify/clientCreds`
  - **GET** `/`
    - Retrieves Platnm playlist.
  - **GET** `/import/new-releases`
    - Imports new releases.
  - **POST** `/import/recommendations`
    - Imports recommendations.
  - **PATCH** `/import/artist-details`
    - Retrieves artist details.
- **Route** `/spotify`
  - **GET** `/playlists`
    - Retrieves current user playlists.
  - **GET** `/top-items`
    - Retrieves top items.

## Secret

- **GET** `/secret`
  - Returns `200 OK` if the user is authenticated.
