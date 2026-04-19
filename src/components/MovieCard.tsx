import { Movie } from "@/types/movie";
import { Film, Star, Plus, Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : null;
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watched, setWatched] = useState(false);

  const stop = (e: React.MouseEvent, fn: () => void) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="group cursor-pointer" onClick={() => onClick(movie)}>
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border bg-card shadow-card">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.Title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-50"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Film className="w-16 h-16 text-muted-foreground" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-start justify-between">
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm font-mono text-xs font-bold text-[hsl(var(--gold))]">
              <Star className="w-3 h-3 fill-current" />
              IMDb
            </span>
            <span className="px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm font-mono text-[10px] text-muted-foreground">
              {movie.Year}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={(e) => stop(e, () => setSaved((v) => !v))}
                className={cn(
                  "w-9 h-9 rounded-full border backdrop-blur-md flex items-center justify-center transition-all hover:scale-110",
                  saved
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background/40 border-border text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground"
                )}
                aria-label="Watchlist"
              >
                {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => stop(e, () => setLiked((v) => !v))}
                className={cn(
                  "w-9 h-9 rounded-full border backdrop-blur-md flex items-center justify-center transition-all hover:scale-110",
                  liked
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background/40 border-border text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground"
                )}
                aria-label="Like"
              >
                <Heart className={cn("w-4 h-4", liked && "fill-current")} />
              </button>
              <button
                onClick={(e) => stop(e, () => setWatched((v) => !v))}
                className={cn(
                  "w-9 h-9 rounded-full border backdrop-blur-md flex items-center justify-center transition-all hover:scale-110",
                  watched
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background/40 border-border text-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground"
                )}
                aria-label="Watched"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={(e) => stop(e, () => onClick(movie))}
              className="w-full py-2 rounded-lg bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Detail →
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1">
        <h3 className="font-display text-sm md:text-base tracking-wide text-foreground truncate group-hover:text-primary transition-colors">
          {movie.Title}
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-0.5 uppercase">
          {movie.Year} · {movie.Type}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
