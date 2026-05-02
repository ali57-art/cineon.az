import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { type MediaItem, normalizeMedia, type MediaType } from "@/services/tmdb";

interface CategoryRowProps {
  title: string;
  items: any[] | undefined;
  loading?: boolean;
  fallbackType?: MediaType;
  seeAllHref?: string;
}

const CategoryRow = ({ title, items, loading, fallbackType, seeAllHref }: CategoryRowProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "l" | "r") => {
    if (!ref.current) return;
    const w = ref.current.clientWidth * 0.8;
    ref.current.scrollBy({ left: dir === "l" ? -w : w, behavior: "smooth" });
  };

  return (
    <section className="space-y-3 group/row">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-display font-bold">{title}</h2>
        {seeAllHref && (
          <Link to={seeAllHref} className="text-sm text-primary hover:underline">
            Hamısına bax →
          </Link>
        )}
      </div>
      <div className="relative">
        <button
          onClick={() => scroll("l")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur shadow-card items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
          aria-label="Sol"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("r")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur shadow-card items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
          aria-label="Sağ"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-40 sm:w-48 aspect-[2/3] rounded-2xl flex-shrink-0" />
              ))
            : items
                ?.filter((it) => it && (it.poster_path || it.backdrop_path))
                .map((it) => {
                  const media: MediaItem = normalizeMedia(it, fallbackType);
                  return (
                    <div key={`${media.media_type}-${media.id}`} className="snap-start">
                      <MediaCard media={media} />
                    </div>
                  );
                })}
        </div>
      </div>
    </section>
  );
};

export default CategoryRow;
