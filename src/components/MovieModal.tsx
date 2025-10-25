import { useEffect, useState } from "react";
import { MovieDetail } from "@/types/movie";
import { getMovieDetails } from "@/services/omdb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Film, Calendar, Clock, Star, Globe, Award, Users } from "lucide-react";
import { toast } from "sonner";

interface MovieModalProps {
  imdbID: string;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal = ({ imdbID, isOpen, onClose }: MovieModalProps) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && imdbID) {
      setLoading(true);
      getMovieDetails(imdbID)
        .then(setMovie)
        .catch((error) => {
          toast.error("Failed to load movie details");
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }, [imdbID, isOpen]);

  const posterUrl = movie?.Poster !== "N/A" ? movie?.Poster : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="grid md:grid-cols-3 gap-6">
              <Skeleton className="h-96 md:col-span-1" />
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ) : movie ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {movie.Title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                  {posterUrl ? (
                    <img 
                      src={posterUrl} 
                      alt={movie.Title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-20 h-20 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {movie.imdbRating !== "N/A" && (
                  <div className="mt-4 flex items-center justify-center gap-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <Star className="w-6 h-6 text-primary fill-primary" />
                    <span className="text-2xl font-bold text-foreground">{movie.imdbRating}</span>
                    <span className="text-muted-foreground">/10</span>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <div className="flex flex-wrap gap-2">
                  {movie.Genre.split(", ").map((genre) => (
                    <Badge key={genre} variant="secondary">{genre}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Released:</span>
                    <span className="text-foreground">{movie.Released}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Runtime:</span>
                    <span className="text-foreground">{movie.Runtime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Country:</span>
                    <span className="text-foreground">{movie.Country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Rated:</span>
                    <span className="text-foreground">{movie.Rated}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Plot</h3>
                  <p className="text-muted-foreground leading-relaxed">{movie.Plot}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <Users className="w-5 h-5 text-primary" />
                    Cast & Crew
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Director: </span>
                      <span className="text-foreground">{movie.Director}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Actors: </span>
                      <span className="text-foreground">{movie.Actors}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Writer: </span>
                      <span className="text-foreground">{movie.Writer}</span>
                    </div>
                  </div>
                </div>
                
                {movie.Awards !== "N/A" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                      <Award className="w-5 h-5 text-primary" />
                      Awards
                    </h3>
                    <p className="text-muted-foreground">{movie.Awards}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;
