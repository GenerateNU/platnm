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
  artist_photo: string;
}

enum NotificationType {
  Follow = "follow",
}

type CustomNotification = {
  id: number;
  tagged_entity_name: string;
  tagged_entity_type: string;
  tagged_entity_id: string;
  thumbnail: string;
  created_at: string;
  read: boolean;
  type: NotificationType;
};

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
  artist_photo: string;
}

interface Artist {
  id: number;
  name: string;
  photo: string;
  bio: string;
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
  user_id: string;
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
  cover_photo: string;
}

type SectionOption = {
  section_id: number;
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
  title?: string;
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
  comment_id: number;
  user_id: string;
  username: string;
  display_name: string;
  profile_picture: string;
  review_id: number;
  comment: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
};

type RatingDistribution = {
  rating: number;
  count: number;
};

type FilterOption = string;

type RecommendationResponse = {
  id: number;
  media_type: string;
  media_id: string;
  recommender_id: string;
  recommender_name: string;
  recommendee_id: string;
  created_at: string;
  reaction: boolean;
  artist_name: string;
  title: string;
  recommender_picture: string;
  cover: string;
};

type PublishReviewRequest = {
  user_id: string;
  media_type: string;
  media_id: number;
  title?: string;
  comment?: string;
  rating: number;
  tags: string[];
  draft: boolean;
};
