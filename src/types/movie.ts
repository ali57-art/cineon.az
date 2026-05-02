// Re-export TMDB types as the canonical types
export type { TMDBMovie, TMDBTV, MediaItem, MediaType } from "@/services/tmdb";
export { normalizeMedia } from "@/services/tmdb";

// Legacy OMDb shape (geriyə uyğunluq üçün — tədricən silinəcək)
export interface OMDbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  imdbRating?: string;
  Plot?: string;
  Genre?: string;
}
