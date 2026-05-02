import { Play, Check } from "lucide-react";
import { tmdb } from "@/services/tmdb";
import { Link } from "react-router-dom";

interface EpisodeCardProps {
  tvId: number;
  episode: {
    id: number;
    episode_number: number;
    season_number: number;
    name: string;
    overview: string;
    still_path: string | null;
    air_date: string;
    runtime?: number | null;
  };
  watched?: boolean;
  progress?: number; // 0-100
}

const EpisodeCard = ({ tvId, episode, watched, progress }: EpisodeCardProps) => (
  <Link
    to={`/watch/tv/${tvId}/${episode.season_number}/${episode.episode_number}`}
    className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
  >
    <div className="relative aspect-video w-40 sm:w-48 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
      <img
        src={tmdb.image.still(episode.still_path, "w300")}
        alt={episode.name}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="w-10 h-10 text-white fill-white" />
      </div>
      {watched && (
        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="w-3 h-3" />
        </div>
      )}
      {typeof progress === "number" && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-muted-foreground">E{episode.episode_number}</span>
        <h3 className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {episode.name}
        </h3>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
        {episode.air_date && <span>{episode.air_date}</span>}
        {episode.runtime ? <span>{episode.runtime} dəq</span> : null}
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{episode.overview}</p>
    </div>
  </Link>
);

export default EpisodeCard;
