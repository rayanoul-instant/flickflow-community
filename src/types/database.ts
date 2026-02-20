export type FilmGenre = 'drama' | 'comedy' | 'horror' | 'scifi' | 'documentary' | 'animation' | 'experimental' | 'romance' | 'thriller' | 'fantasy';

export interface Film {
  id: string;
  title: string;
  synopsis: string | null;
  duration_minutes: number;
  video_url: string;
  thumbnail_url: string | null;
  genres: FilmGenre[];
  themes: string[];
  release_year: number | null;
  director: string | null;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  average_rating?: number;
}

export interface Profile {
  id: string;
  username: string;
  bio: string | null;
  avatar_base: string;
  avatar_accessories: string[];
  created_at: string;
  updated_at: string;
}

export interface FilmRating {
  id: string;
  film_id: string;
  user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  film_id: string;
  created_at: string;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  film_id: string;
  watched_at: string;
  progress_seconds: number;
  film?: Film;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author_id: string;
  film_id: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  film?: Film;
}

export interface Comment {
  id: string;
  discussion_id: string;
  author_id: string;
  content: string;
  parent_id: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  replies?: Comment[];
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: Profile;
  receiver_profile?: Profile;
}

export const GENRE_LABELS: Record<FilmGenre, string> = {
  drama: 'Drama',
  comedy: 'Comedy',
  horror: 'Horror',
  scifi: 'Sci-Fi',
  documentary: 'Documentary',
  animation: 'Animation',
  experimental: 'Experimental',
  romance: 'Romance',
  thriller: 'Thriller',
  fantasy: 'Fantasy',
};

export const AVATAR_BASES = ['default', 'cat', 'dog', 'robot', 'alien', 'ghost'];
export const AVATAR_ACCESSORIES = {
  hats: ['none', 'fedora', 'beret', 'crown', 'cowboy', 'wizard'],
  glasses: ['none', 'round', 'square', 'sunglasses', 'monocle'],
  accessories: ['none', 'bowtie', 'scarf', 'necklace', 'earrings'],
};
