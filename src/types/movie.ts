// Re-export TMDB types
export type { TMDBMovie, TMDBTV, MediaItem, MediaType } from "@/services/tmdb";
export { normalizeMedia } from "@/services/tmdb";

// ============================================
// Legacy OMDb tipləri (geriyə uyğunluq üçün)
// Yeni kod TMDB tiplərini istifadə etməlidir.
// ============================================

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface SearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface MovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  totalSeasons?: string;
  Response: string;
}
