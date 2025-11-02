import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies, getRandomMovie } from "@/services/omdb";
import { Movie } from "@/types/movie";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import MovieGrid from "@/components/MovieGrid";
import MovieModal from "@/components/MovieModal";
import EmptyState from "@/components/EmptyState";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import AIRecommendations from "@/components/AIRecommendations";
import AIWatchPlan from "@/components/AIWatchPlan";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingSeries, setTrendingSeries] = useState<Movie[]>([]);
  const [trendingCartoons, setTrendingCartoons] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlans, setShowPlans] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        const randomMovie = await getRandomMovie();
        const randomSeries = await getRandomMovie();
        const randomCartoon = await getRandomMovie();
        
        const moviesData = await searchMovies(randomMovie.Title, 1, "movie");
        const seriesData = await searchMovies(randomSeries.Title, 1, "series");
        const cartoonsData = await searchMovies("animation", 1, "movie");
        
        setTrendingMovies(moviesData.Search?.slice(0, 6) || []);
        setTrendingSeries(seriesData.Search?.slice(0, 6) || []);
        setTrendingCartoons(cartoonsData.Search?.slice(0, 6) || []);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      }
    };

    if (user) {
      fetchTrendingContent();
      const interval = setInterval(fetchTrendingContent, 3600000); // Update every hour
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    try {
      const response = await searchMovies(query, 1);
      setMovies(response.Search || []);
      toast({
        title: t("success", language),
        description: `${response.totalResults} ${t("noResults", language)}`,
      });
    } catch (error) {
      toast({
        title: t("error", language),
        description: t("errorSearch", language),
        variant: "destructive",
      });
      setMovies([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.imdbID);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShowPlans={() => setShowPlans(!showPlans)} />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            {t("welcome", language)}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("searchMovies", language)}
          </p>
        </div>

        {showPlans && (
          <div className="animate-fade-in">
            <SubscriptionPlans />
          </div>
        )}

        <div className="animate-slide-up">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <AIRecommendations />
          <AIWatchPlan />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && movies.length > 0 && (
          <MovieGrid movies={movies} onMovieClick={handleMovieClick} />
        )}

        {!isLoading && !searchQuery && (
          <div className="space-y-12">
            {trendingMovies.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  🎬 {t("trendingMovies", language)}
                </h2>
                <MovieGrid movies={trendingMovies} onMovieClick={handleMovieClick} />
              </section>
            )}

            {trendingSeries.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  📺 {t("trendingSeries", language)}
                </h2>
                <MovieGrid movies={trendingSeries} onMovieClick={handleMovieClick} />
              </section>
            )}

            {trendingCartoons.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  🎨 {t("trendingCartoons", language)}
                </h2>
                <MovieGrid movies={trendingCartoons} onMovieClick={handleMovieClick} />
              </section>
            )}
          </div>
        )}

        {!isLoading && searchQuery && movies.length === 0 && (
          <EmptyState />
        )}

        {selectedMovieId && (
          <MovieModal
            imdbID={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;