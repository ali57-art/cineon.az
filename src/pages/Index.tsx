import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import CategoryRow from "@/components/CategoryRow";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import {
  useTrendingMovies,
  useTrendingTV,
  usePopularMovies,
  usePopularTV,
  useTopRatedMovies,
  useUpcomingMovies,
  useMoviesByGenre,
} from "@/hooks/useMovies";

const Index = () => {
  const [showPlans, setShowPlans] = useState(false);
  const trendingMovies = useTrendingMovies();
  const trendingTV = useTrendingTV();
  const popularMovies = usePopularMovies();
  const popularTV = usePopularTV();
  const topRated = useTopRatedMovies();
  const upcoming = useUpcomingMovies();
  const drama = useMoviesByGenre(18);
  const action = useMoviesByGenre(28);
  const animation = useMoviesByGenre(16);
  const documentary = useMoviesByGenre(99);

  // Birləşdirilmiş trending (film + tv) — hero üçün
  const heroItems = [
    ...((trendingMovies.data?.results ?? []).slice(0, 3)),
    ...((trendingTV.data?.results ?? []).slice(0, 2)),
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <Header onShowPlans={() => setShowPlans(true)} />

      <main className="container mx-auto px-4 py-6 space-y-12">
        <HeroBanner items={heroItems} loading={trendingMovies.isLoading || trendingTV.isLoading} />

        <CategoryRow
          title="Bu Həftə Trend"
          items={trendingMovies.data?.results}
          loading={trendingMovies.isLoading}
          fallbackType="movie"
          seeAllHref="/trending"
        />
        <CategoryRow
          title="Populyar Filmlər"
          items={popularMovies.data?.results}
          loading={popularMovies.isLoading}
          fallbackType="movie"
          seeAllHref="/movies"
        />
        <CategoryRow
          title="Populyar Seriallar"
          items={popularTV.data?.results}
          loading={popularTV.isLoading}
          fallbackType="tv"
          seeAllHref="/series"
        />
        <CategoryRow
          title="Yüksək Reytinqli"
          items={topRated.data?.results}
          loading={topRated.isLoading}
          fallbackType="movie"
          seeAllHref="/top-rated"
        />
        <CategoryRow
          title="Yeni Çıxanlar"
          items={upcoming.data?.results}
          loading={upcoming.isLoading}
          fallbackType="movie"
          seeAllHref="/new-releases"
        />
        <CategoryRow title="Dram" items={drama.data?.results} loading={drama.isLoading} fallbackType="movie" seeAllHref="/genre/movie/18" />
        <CategoryRow title="Aksion & Macəra" items={action.data?.results} loading={action.isLoading} fallbackType="movie" seeAllHref="/genre/movie/28" />
        <CategoryRow title="Animasiya" items={animation.data?.results} loading={animation.isLoading} fallbackType="movie" seeAllHref="/genre/movie/16" />
        <CategoryRow title="Sənədli" items={documentary.data?.results} loading={documentary.isLoading} fallbackType="movie" seeAllHref="/genre/movie/99" />
      </main>

      <Footer />

      {showPlans && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-xl z-[100] overflow-y-auto py-12 px-4" onClick={() => setShowPlans(false)}>
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl mx-auto">
            <SubscriptionPlans />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
