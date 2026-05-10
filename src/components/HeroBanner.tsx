import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tmdb, type MediaItem, normalizeMedia } from "@/services/tmdb";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroBannerProps {
  items: any[] | undefined;
  loading?: boolean;
}

const HeroBanner = ({ items, loading }: HeroBannerProps) => {
  const [idx, setIdx] = useState(0);
  const slides: MediaItem[] = (items ?? []).filter((i) => i.backdrop_path).slice(0, 5).map((i) => normalizeMedia(i));

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (loading || slides.length === 0) {
    return <Skeleton className="w-full h-[55vh] min-h-[360px] md:min-h-[480px] rounded-2xl md:rounded-3xl" />;
  }

  const cur = slides[idx];
  const detailHref = cur.media_type === "movie" ? `/movie/${cur.id}` : `/tv/${cur.id}`;

  return (
    <section className="relative w-full h-[55vh] min-h-[360px] md:min-h-[480px] lg:min-h-[560px] rounded-2xl md:rounded-3xl overflow-hidden shadow-float bg-grain">
      <div className="absolute inset-0 transition-opacity duration-1000">
        <img
          src={tmdb.image.backdrop(cur.backdrop_path, "w1280")}
          alt={cur.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-end md:items-center p-4 sm:p-6 md:p-12 max-w-3xl">
        <div className="space-y-3 sm:space-y-4 animate-fade-up w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-[10px] sm:text-xs font-bold uppercase">
              {cur.media_type === "tv" ? "Serial" : "Film"}
            </span>
            {cur.vote_average > 0 && (
              <span className="flex items-center gap-1 text-xs sm:text-sm font-semibold">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                {cur.vote_average.toFixed(1)}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-display font-bold tracking-tight text-gradient-headline leading-tight">
            {cur.title}
          </h1>
          {cur.overview && (
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3 max-w-xl">{cur.overview}</p>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <Button asChild size="lg" className="gap-2 rounded-full">
              <Link to={cur.media_type === "movie" ? `/watch/movie/${cur.id}` : `/watch/tv/${cur.id}/1/1`}>
                <Play className="w-4 h-4 fill-current" /> İzlə
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="gap-2 rounded-full glass-surface">
              <Link to={detailHref}>
                <Info className="w-4 h-4" /> Ətraflı
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-foreground/40"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
