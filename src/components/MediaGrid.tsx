import MediaCard from "./MediaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { type MediaItem, normalizeMedia, type MediaType } from "@/services/tmdb";
import { Film } from "lucide-react";

interface MediaGridProps {
  items: any[] | undefined;
  loading?: boolean;
  fallbackType?: MediaType;
  emptyText?: string;
  showType?: boolean;
}

const MediaGrid = ({ items, loading, fallbackType, emptyText = "Məlumat tapılmadı", showType }: MediaGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Film className="w-12 h-12 mb-3 opacity-40" />
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items
        .filter((it) => it && (it.poster_path || it.backdrop_path))
        .map((it) => {
          const media: MediaItem = normalizeMedia(it, fallbackType);
          return <MediaCard key={`${media.media_type}-${media.id}`} media={media} showType={showType} />;
        })}
    </div>
  );
};

export default MediaGrid;
