import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value?: number; // 0-10
  onRate?: (v: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

const sizeMap = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };

const RatingStars = ({ value = 0, onRate, size = "md", readOnly }: RatingStarsProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => {
        const filled = display > i;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
            onClick={() => !readOnly && onRate?.(i + 1)}
            className={cn("transition-transform", !readOnly && "hover:scale-125 cursor-pointer")}
            aria-label={`${i + 1}/10`}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" : "text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
      {value > 0 && <span className="ml-2 text-sm font-semibold">{value.toFixed(1)}</span>}
    </div>
  );
};

export default RatingStars;
