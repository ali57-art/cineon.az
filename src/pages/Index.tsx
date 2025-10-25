import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "@/types/movie";
import { searchMovies } from "@/services/omdb";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import MovieGrid from "@/components/MovieGrid";
import MovieModal from "@/components/MovieModal";
import EmptyState from "@/components/EmptyState";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    
    try {
      const response = await searchMovies(query);
      setMovies(response.Search);
      toast.success(`Found ${response.totalResults} results`);
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
          isOpen={!!selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  );
};

export default Index;
