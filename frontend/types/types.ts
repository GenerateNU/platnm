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
  artist_name: string;
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
  artist_name: string;
}

type Media = Album | Track;

type Review = {
  id: number;
  user_id: string;
  media_type: string;
  media_id: number;
  rating: number;
  comment: string;
  username: string;
  display_name: string;
  profile_picture: string;
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

type Section = {
  section_id: number;
  title: string;
  items: SectionItem[];
  search_type: string;
};

interface SectionItem {
  id: number;
  title: string;
  media_type: string;
  cover: string;
}

type SectionOption = {
  title: string;
  search_type: string;
};

type ReviewStat = {
  upvotes: number;
  downvotes: number;
  comment_count: number;
};

type Preview = {
  review_id: number;
  user_id: string;
  username: string;
  display_name: string;
  profile_picture: string;
  media_type: MediaType;
  media_id: number;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
  media_cover: string;
  media_title: string;
  media_artist: string;
  tags: string[];
  review_stat: ReviewStat;
};

type MediaResponse = {
  media: Media;
  reviewCount: number;
};

type UserComment = {
  id: number;
  user_id: string;
  review_id: number;
  comment: string;
  created_at: string;
  // upvotes: number;
  // downvotes: number;
};

type RatingDistribution = {
  rating: number;
  count: number;
};
