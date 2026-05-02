import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/services/tmdb";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export type SearchType = "multi" | "movie" | "tv" | "person";

export const useSearch = (query: string, type: SearchType = "multi", page = 1) => {
  const debounced = useDebounce(query.trim(), 300);
  return useQuery({
    queryKey: ["search", type, debounced, page],
    queryFn: () => {
      if (type === "movie") return tmdb.searchMovies(debounced, page);
      if (type === "tv") return tmdb.searchTV(debounced, page);
      if (type === "person") return tmdb.searchPerson(debounced, page);
      return tmdb.searchMulti(debounced, page);
    },
    enabled: debounced.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
};
