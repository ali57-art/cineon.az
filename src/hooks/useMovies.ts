import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/services/tmdb";

const STALE = 1000 * 60 * 5; // 5 dəq

export const useTrendingMovies = (window: "day" | "week" = "week") =>
  useQuery({ queryKey: ["trending", "movie", window], queryFn: () => tmdb.trendingMovies(window), staleTime: STALE });

export const useTrendingTV = (window: "day" | "week" = "week") =>
  useQuery({ queryKey: ["trending", "tv", window], queryFn: () => tmdb.trendingTV(window), staleTime: STALE });

export const usePopularMovies = (page = 1) =>
  useQuery({ queryKey: ["popular", "movie", page], queryFn: () => tmdb.popularMovies(page), staleTime: STALE });

export const usePopularTV = (page = 1) =>
  useQuery({ queryKey: ["popular", "tv", page], queryFn: () => tmdb.popularTV(page), staleTime: STALE });

export const useTopRatedMovies = (page = 1) =>
  useQuery({ queryKey: ["topRated", "movie", page], queryFn: () => tmdb.topRatedMovies(page), staleTime: STALE });

export const useTopRatedTV = (page = 1) =>
  useQuery({ queryKey: ["topRated", "tv", page], queryFn: () => tmdb.topRatedTV(page), staleTime: STALE });

export const useUpcomingMovies = () =>
  useQuery({ queryKey: ["upcoming", "movie"], queryFn: () => tmdb.upcomingMovies(), staleTime: STALE });

export const useNowPlayingMovies = () =>
  useQuery({ queryKey: ["nowPlaying", "movie"], queryFn: () => tmdb.nowPlayingMovies(), staleTime: STALE });

export const useMovieDetails = (id: number | undefined) =>
  useQuery({
    queryKey: ["movie", id],
    queryFn: () => tmdb.movieDetails(id!),
    enabled: !!id,
    staleTime: STALE,
  });

export const useTVDetails = (id: number | undefined) =>
  useQuery({
    queryKey: ["tv", id],
    queryFn: () => tmdb.tvDetails(id!),
    enabled: !!id,
    staleTime: STALE,
  });

export const useTVSeason = (id: number | undefined, season: number | undefined) =>
  useQuery({
    queryKey: ["tv", id, "season", season],
    queryFn: () => tmdb.tvSeason(id!, season!),
    enabled: !!id && season !== undefined,
    staleTime: STALE,
  });

export const usePersonDetails = (id: number | undefined) =>
  useQuery({
    queryKey: ["person", id],
    queryFn: () => tmdb.personDetails(id!),
    enabled: !!id,
    staleTime: STALE,
  });

export const useMovieGenres = () =>
  useQuery({ queryKey: ["genres", "movie"], queryFn: () => tmdb.movieGenres(), staleTime: 1000 * 60 * 60 });

export const useTVGenres = () =>
  useQuery({ queryKey: ["genres", "tv"], queryFn: () => tmdb.tvGenres(), staleTime: 1000 * 60 * 60 });

export const useMoviesByGenre = (genreId: number | undefined, page = 1) =>
  useQuery({
    queryKey: ["genre", "movie", genreId, page],
    queryFn: () => tmdb.moviesByGenre(genreId!, page),
    enabled: !!genreId,
    staleTime: STALE,
  });

export const useTVByGenre = (genreId: number | undefined, page = 1) =>
  useQuery({
    queryKey: ["genre", "tv", genreId, page],
    queryFn: () => tmdb.tvByGenre(genreId!, page),
    enabled: !!genreId,
    staleTime: STALE,
  });

export const useDiscoverMovies = (params: Record<string, string | number>) =>
  useQuery({
    queryKey: ["discover", "movie", params],
    queryFn: () => tmdb.discoverMovies(params),
    staleTime: STALE,
  });

export const useDiscoverTV = (params: Record<string, string | number>) =>
  useQuery({
    queryKey: ["discover", "tv", params],
    queryFn: () => tmdb.discoverTV(params),
    staleTime: STALE,
  });
