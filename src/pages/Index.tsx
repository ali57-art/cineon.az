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
import Footer from "@/components/Footer";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import AIRecommendations from "@/components/AIRecommendations";
import AIWatchPlan from "@/components/AIWatchPlan";
import GenreGrid from "@/components/GenreGrid";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader2, Film, Bot, Tv, Palette, Star, Sparkles, Flag, TrendingUp } from "lucide-react";
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
        {/* Cinematic Hero v3 — light premium */}
        <section className="relative -mx-4 px-4 min-h-[85vh] flex items-center justify-center bg-cineon-hero bg-grain overflow-hidden rounded-b-3xl">
          {/* Soft red radial glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,hsl(var(--primary)/0.18),transparent_55%),radial-gradient(circle_at_85%_75%,hsl(var(--primary-glow)/0.12),transparent_50%)]" />

          <div className="relative text-center space-y-8 animate-fade-in max-w-5xl mx-auto py-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-mono uppercase tracking-[0.2em] text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Cineon Platform
            </div>

            <h1 className="font-display font-black leading-[0.95] text-[52px] sm:text-7xl md:text-8xl lg:text-[104px] tracking-[-0.02em] text-gradient-headline">
              {t("heroTitle", language)}
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("heroSubtitle", language)}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate("/movies")}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-elegant active:scale-[0.98]"
              >
                <Film className="w-5 h-5" />
                {t("browseMovies", language)}
              </button>
              <button
                onClick={() => navigate("/ai-recommend")}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary/40 text-foreground font-semibold transition-all duration-200 hover:scale-[1.03] hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
              >
                <Bot className="w-5 h-5" />
                {t("findWithAI", language)}
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce-slow" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 border-y border-border py-6">
          {[
            { icon: Film, num: "10K+", label: t("statsFilms", language) },
            { icon: Star, num: "2M+", label: t("statsRatings", language) },
            { icon: Bot, num: "AI", label: t("statsAI", language) },
            { icon: Flag, num: "AZ", label: t("statsAZ", language) },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-1 px-4 text-center border-r border-border last:border-r-0 [&:nth-child(2)]:max-md:border-r-0">
                <Icon className="w-5 h-5 text-primary mb-1" />
                <div className="font-display text-2xl md:text-3xl text-primary tracking-wide">{s.num}</div>
                <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </section>

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
            <GenreGrid />

            {trendingMovies.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Film className="w-6 h-6 text-primary" />
                  {t("trendingMovies", language)}
                </h2>
                <MovieGrid movies={trendingMovies} onMovieClick={handleMovieClick} />
              </section>
            )}

            {trendingMovies.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  {t("topTen", language)}
                </h2>
                <ol className="space-y-3">
                  {trendingMovies.slice(0, 10).map((m, i) => (
                    <li
                      key={m.imdbID}
                      onClick={() => handleMovieClick(m)}
                      className="group relative flex items-center gap-4 p-3 md:p-4 rounded-2xl border border-border bg-card shadow-card hover:-translate-y-0.5 hover:shadow-float hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <span
                        className={cn(
                          "font-display font-black leading-none w-16 md:w-24 text-center select-none",
                          "text-6xl md:text-8xl tracking-[-0.04em]",
                          i === 0
                            ? "text-transparent [-webkit-text-stroke:2px_hsl(var(--gold))]"
                            : "text-transparent [-webkit-text-stroke:2px_hsl(var(--muted-foreground)/0.35)] group-hover:[-webkit-text-stroke-color:hsl(var(--primary)/0.6)] transition-colors"
                        )}
                      >
                        {i + 1}
                      </span>
                      {m.Poster !== "N/A" && (
                        <img src={m.Poster} alt={m.Title} className="w-14 h-20 md:w-16 md:h-24 object-cover rounded-lg shadow-card" loading="lazy" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base md:text-lg tracking-wide truncate group-hover:text-primary transition-colors">
                          {m.Title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono uppercase">{m.Year} · {m.Type}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {trendingSeries.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Tv className="w-6 h-6 text-primary" />
                  {t("trendingSeries", language)}
                </h2>
                <MovieGrid movies={trendingSeries} onMovieClick={handleMovieClick} />
              </section>
            )}

            {trendingCartoons.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-primary" />
                  {t("trendingCartoons", language)}
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
      <Footer />
    </div>
  );
};

export default Index;