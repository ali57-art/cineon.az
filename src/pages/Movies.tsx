import { useState } from "react";
import { Movie } from "@/types/movie";
import { searchMovies } from "@/services/omdb";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import MovieGrid from "@/components/MovieGrid";
import MovieModal from "@/components/MovieModal";
import EmptyState from "@/components/EmptyState";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    
    try {
      const response = await searchMovies(query, 1, "movie");
      setMovies(response.Search);
      toast.success(`Found ${response.totalResults} movies`);
    } catch (error) {
      toast.error("Failed to search movies. Please try again.");
      setMovies([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.imdbID);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
        ) : (
          <EmptyState query={searchQuery} />
        )}
      </main>

      {selectedMovieId && (
        <MovieModal
          imdbID={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  );
};

export default Movies;
