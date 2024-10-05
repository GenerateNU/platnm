type MediaType = string;

interface Album {
  media: MediaType;
  id: number;
  title: string;
  release_date: Date;
  cover: string;
  country: string;
  genre_id: number;
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
}

type Media = Album | Track;

type Review = {
  id: number;
  userId: string;
  mediaType: string;
  mediaId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};
