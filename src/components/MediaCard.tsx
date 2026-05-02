import { Link } from "react-router-dom";
import { Star, Plus, Check, Play } from "lucide-react";
import { tmdb, type MediaItem, type MediaType } from "@/services/tmdb";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  media: MediaItem;
  size?: "sm" | "md" | "lg";
  showType?: boolean;
}

const sizes = {
  sm: "w-32 sm:w-36",
  md: "w-40 sm:w-48",
  lg: "w-52 sm:w-60",
};

const MediaCard = ({ media, size = "md", showType }: MediaCardProps) => {
  const { add, remove, isInWatchlist } = useWatchlist();
  const inList = isInWatchlist(media.id, media.media_type);
  const year = media.release_date ? new Date(media.release_date).getFullYear() : null;
  const detailHref = media.media_type === "movie" ? `/movie/${media.id}` : `/tv/${media.id}`;

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      remove.mutate({ media_id: media.id, media_type: media.media_type });
    } else {
      add.mutate({
        media_id: media.id,
        media_type: media.media_type,
        title: media.title,
        poster: media.poster_path,
        year: year ? String(year) : null,
      });
    }
  };

  return (
    <Link to={detailHref} className={cn("group block flex-shrink-0", sizes[size])}>
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-muted shadow-card group-hover:shadow-float transition-all duration-300 group-hover:-translate-y-1">
        <img
          src={tmdb.image.poster(media.poster_path, "w500")}
          alt={media.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,hsl(var(--primary)/0.55)_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" className="flex-1 h-8 text-xs gap-1" variant="default">
            <Play className="w-3 h-3" /> Bax
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0"
            onClick={onToggle}
            aria-label={inList ? "Siyahıdan çıxar" : "Siyahıya əlavə et"}
          >
            {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
        {/* Rating badge */}
        {media.vote_average > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-semibold">
            <Star className="w-3 h-3 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
            {media.vote_average.toFixed(1)}
          </div>
        )}
        {showType && (
          <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            {media.media_type === "tv" ? "Serial" : "Film"}
          </div>
        )}
      </div>
      <div className="mt-2 space-y-0.5 px-1">
        <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{media.title}</h3>
        {year && <p className="text-xs text-muted-foreground">{year}</p>}
      </div>
    </Link>
  );
};

export default MediaCard;
