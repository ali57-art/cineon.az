import { useState } from "react";
import { Movie } from "@/types/movie";
import { getRandomMovie } from "@/services/omdb";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";

const Random = () => {
  const { language } = useLanguage();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const handleGetRandom = async () => {
    setLoading(true);
    try {
      const randomMovie = await getRandomMovie();
      setMovie(randomMovie);
      toast.success("Random movie found!");
    } catch (error) {
      toast.error("Failed to get random movie. Please try again.");
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t("randomMovie", language)}
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover something unexpected!
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleGetRandom}
            disabled={loading}
            className="gap-2 px-8 py-6 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("loading", language)}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get Random Movie
              </>
            )}
          </Button>

          {movie && !loading && (
            <div className="w-full max-w-sm animate-fade-in">
              <MovieCard movie={movie} onClick={() => handleMovieClick(movie)} />
            </div>
          )}
        </div>
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

export default Random;
