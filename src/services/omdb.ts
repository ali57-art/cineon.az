import { Movie, MovieDetail, SearchResponse } from "@/types/movie";
import { supabase } from "@/integrations/supabase/client";

export type ContentType = "movie" | "series" | "episode" | "";

export const searchMovies = async (
  query: string, 
  page: number = 1,
  type: ContentType = ""
): Promise<SearchResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('omdb-proxy', {
      body: { 
        searchQuery: query,
        type: type || undefined,
        page
      }
    });
    
    if (error) throw error;
    
    if (data.Response === "False") {
      throw new Error(data.Error || "No movies found");
    }
    
    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (imdbID: string): Promise<MovieDetail> => {
  try {
    const { data, error } = await supabase.functions.invoke('omdb-proxy', {
      body: { imdbId: imdbID }
    });
    
    if (error) throw error;
    
    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getRandomMovie = async (): Promise<Movie> => {
  const randomWords = [
    "love", "war", "life", "dream", "hero", "time", "world", "city",
    "star", "dark", "light", "king", "queen", "fight", "story", "legend",
    "space", "magic", "dragon", "robot", "alien", "future", "past", "secret"
  ];
  
  const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
  const response = await searchMovies(randomWord);
  
  if (response.Search && response.Search.length > 0) {
    const randomIndex = Math.floor(Math.random() * response.Search.length);
    return response.Search[randomIndex];
  }
  
  throw new Error("No random movie found");
};
