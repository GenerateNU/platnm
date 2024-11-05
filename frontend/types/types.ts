type MediaType = string;

interface Album {
  media: MediaType;
  id: number;
  title: string;
  release_date: Date;
  cover: string;
  country: string;
  genre_id: number;
  media_type: string;
}

interface Track {
  media: MediaType;
  id: number;
  album_id: number;
  album_title: string;
  title: string;
  duration: number; // duration in seconds
  release_date: Date;
  cover: string;
  media_type: string;
}

type Media = Album | Track;

type Review = {
  id: number;
  user_id: string;
  media_type: string;
  media_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
};

type User = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  profile_picture: string;
  linked_account: string;
  created_at: string;
  updated_at: string;
};

type UserProfile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  profile_picture: string;
  followers: number;
  followed: number;
  score: number;
};

type MediaResponse = {
  media: Media;
  reviewCount: number;
};