import { supabase } from "@/integrations/supabase/client";

const IMG = "https://image.tmdb.org/t/p";

async function call<T = any>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke("tmdb-proxy", {
    body: { endpoint, params },
  });
  if (error) throw error;
  if (data?.status_code && data.status_code >= 400) throw new Error(data.status_message || "TMDB error");
  return data as T;
}

export const tmdb = {
  // Movies
  popularMovies: (page = 1) => call("/movie/popular", { page }),
  trendingMovies: (window: "day" | "week" = "week") => call(`/trending/movie/${window}`),
  topRatedMovies: (page = 1) => call("/movie/top_rated", { page }),
  upcomingMovies: () => call("/movie/upcoming"),
  nowPlayingMovies: () => call("/movie/now_playing"),
  movieDetails: (id: number) =>
    call(`/movie/${id}`, { append_to_response: "credits,videos,similar,recommendations,reviews,images,keywords" }),
  moviesByGenre: (genreId: number, page = 1) =>
    call("/discover/movie", { with_genres: genreId, page, sort_by: "popularity.desc" }),

  // TV
  popularTV: (page = 1) => call("/tv/popular", { page }),
  trendingTV: (window: "day" | "week" = "week") => call(`/trending/tv/${window}`),
  topRatedTV: (page = 1) => call("/tv/top_rated", { page }),
  tvDetails: (id: number) =>
    call(`/tv/${id}`, { append_to_response: "credits,videos,similar,recommendations,content_ratings,images" }),
  tvSeason: (id: number, season: number) => call(`/tv/${id}/season/${season}`),
  tvEpisode: (id: number, season: number, episode: number) =>
    call(`/tv/${id}/season/${season}/episode/${episode}`),
  tvByGenre: (genreId: number, page = 1) =>
    call("/discover/tv", { with_genres: genreId, page, sort_by: "popularity.desc" }),

  // Search
  searchMulti: (query: string, page = 1) => call("/search/multi", { query, page }),
  searchMovies: (query: string, page = 1) => call("/search/movie", { query, page }),
  searchTV: (query: string, page = 1) => call("/search/tv", { query, page }),
  searchPerson: (query: string, page = 1) => call("/search/person", { query, page }),

  // Person
  personDetails: (id: number) =>
    call(`/person/${id}`, { append_to_response: "movie_credits,tv_credits,images" }),

  // Genres
  movieGenres: () => call("/genre/movie/list"),
  tvGenres: () => call("/genre/tv/list"),

  // Discover
  discoverMovies: (params: Record<string, string | number>) => call("/discover/movie", params),
  discoverTV: (params: Record<string, string | number>) => call("/discover/tv", params),

  // Image helpers
  image: {
    poster: (path: string | null, size: "w185" | "w342" | "w500" | "w780" | "original" = "w500") =>
      path ? `${IMG}/${size}${path}` : "/placeholder.svg",
    backdrop: (path: string | null, size: "w300" | "w780" | "w1280" | "original" = "w1280") =>
      path ? `${IMG}/${size}${path}` : "/placeholder.svg",
    profile: (path: string | null, size: "w45" | "w185" | "h632" | "original" = "w185") =>
      path ? `${IMG}/${size}${path}` : "/placeholder.svg",
    still: (path: string | null, size: "w92" | "w185" | "w300" | "original" = "w300") =>
      path ? `${IMG}/${size}${path}` : "/placeholder.svg",
  },
};

// TMDB Types
export interface TMDBMovie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
}

export interface TMDBTV {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
}

export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  title: string; // unified
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  media_type: MediaType;
  overview?: string;
}

export function normalizeMedia(raw: any, fallbackType?: MediaType): MediaItem {
  const type: MediaType = raw.media_type || fallbackType || (raw.title ? "movie" : "tv");
  return {
    id: raw.id,
    title: raw.title || raw.name,
    poster_path: raw.poster_path,
    backdrop_path: raw.backdrop_path,
    release_date: raw.release_date || raw.first_air_date,
    vote_average: raw.vote_average ?? 0,
    media_type: type,
    overview: raw.overview,
  };
}
