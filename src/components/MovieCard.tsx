import { Movie } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Film, Calendar } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : null;

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-border bg-card group"
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] relative bg-secondary overflow-hidden">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={movie.Title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {movie.Title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{movie.Year}</span>
          <span className="ml-auto px-2 py-0.5 rounded bg-primary/10 text-primary text-xs uppercase">
            {movie.Type}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
