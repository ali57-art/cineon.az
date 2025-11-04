import { useEffect, useState } from "react";
import { getMovieDetails } from "@/services/omdb";
import { MovieDetail } from "@/types/movie";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Film, Calendar, Clock, Star, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import PlatformLinks from "./PlatformLinks";
import AIMovieReview from "./AIMovieReview";
import AISimilarMovies from "./AISimilarMovies";
import AIMovieSummary from "./AIMovieSummary";
import { Separator } from "@/components/ui/separator";

interface MovieModalProps {
  imdbID: string;
  onClose: () => void;
}

const MovieModal = ({ imdbID, onClose }: MovieModalProps) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(imdbID);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    if (imdbID) {
      fetchMovie();
    }
  }, [imdbID]);

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{movie.Title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {movie.Poster !== "N/A" && (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{movie.Year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{movie.Runtime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>{movie.imdbRating}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-primary" />
                <span>{movie.Genre}</span>
              </div>
            </div>

            <PlatformLinks 
              title={movie.Title} 
              imdbID={imdbID}
            />

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("plot", language)}</h3>
              <p className="text-muted-foreground">{movie.Plot}</p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <AIMovieSummary 
                title={movie.Title}
                year={movie.Year}
                plot={movie.Plot}
                genre={movie.Genre}
              />

              <AIMovieReview 
                title={movie.Title}
                year={movie.Year}
                plot={movie.Plot}
              />
              
              <AISimilarMovies
                title={movie.Title}
                genre={movie.Genre}
                year={movie.Year}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("director", language)}</h3>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>{movie.Director}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("actors", language)}</h3>
              <p className="text-muted-foreground">{movie.Actors}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;
