import { Movie, MovieDetail, SearchResponse } from "@/types/movie";

const API_KEY = "65ba8522"; // OMDb API key
const BASE_URL = "https://www.omdbapi.com/";

export const searchMovies = async (query: string, page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    
    const data = await response.json();
    
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
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }
    
    const data = await response.json();
    
    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
