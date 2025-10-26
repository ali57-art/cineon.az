import { Movie, MovieDetail, SearchResponse } from "@/types/movie";

const API_KEY = "ed745323"; // OMDb API key
const BASE_URL = "https://www.omdbapi.com/";

export type ContentType = "movie" | "series" | "episode" | "";

export const searchMovies = async (
  query: string, 
  page: number = 1,
  type: ContentType = ""
): Promise<SearchResponse> => {
  try {
    let url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
    if (type) {
      url += `&type=${type}`;
    }
    
    const response = await fetch(url);
    
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
