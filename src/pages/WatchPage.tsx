import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { videoProvider } from "@/services/videoProvider";
import { useMovieDetails, useTVDetails, useTVSeason } from "@/hooks/useMovies";
import { useWatchHistory } from "@/hooks/useWatchHistory";

const WatchPage = () => {
  const { type, id, season, episode } = useParams();
  const navigate = useNavigate();
  const mediaId = Number(id);
  const isTv = type === "tv";
  const seasonNum = Number(season ?? 1);
  const episodeNum = Number(episode ?? 1);

  const movie = useMovieDetails(!isTv ? mediaId : undefined);
  const tv = useTVDetails(isTv ? mediaId : undefined);
  const seasonData = useTVSeason(isTv ? mediaId : undefined, isTv ? seasonNum : undefined);

  const { saveProgress } = useWatchHistory();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  const source = isTv
    ? videoProvider.getEpisodeSource(mediaId, seasonNum, episodeNum)
    : videoProvider.getMovieSource(mediaId);
  const src = useFallback ? source.fallbackUrl : source.url;

  const title = isTv ? tv.data?.name : movie.data?.title;
  const seasons = (tv.data?.seasons ?? []).filter((s: any) => s.season_number > 0);
  const episodes = seasonData.data?.episodes ?? [];
  const currentEp = episodes.find((e: any) => e.episode_number === episodeNum);
  const nextEp = episodes.find((e: any) => e.episode_number === episodeNum + 1);

  // Watch history qeyd et
  useEffect(() => {
    if (!mediaId) return;
    const t = setTimeout(() => {
      saveProgress.mutate({
        media_id: mediaId,
        media_type: isTv ? "tv" : "movie",
        season_number: isTv ? seasonNum : null,
        episode_number: isTv ? episodeNum : null,
        progress_seconds: 0,
        duration_seconds: 0,
        completed: false,
      });
    }, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId, isTv, seasonNum, episodeNum]);

  const goFullscreen = () => {
    const el = iframeRef.current as any;
    if (!el) return;
    (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
  };

  const goNext = () => {
    if (!isTv) return;
    if (nextEp) navigate(`/watch/tv/${mediaId}/${seasonNum}/${episodeNum + 1}`);
    else {
      const nextSeason = seasons.find((s: any) => s.season_number === seasonNum + 1);
      if (nextSeason) navigate(`/watch/tv/${mediaId}/${seasonNum + 1}/1`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 bg-background/95 backdrop-blur border-b border-border/40">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Geri</span>
        </Button>
        <div className="flex-1 min-w-0 text-center">
          <p className="truncate text-sm sm:text-base font-semibold">
            {title}
            {isTv && currentEp && (
              <span className="text-muted-foreground font-normal">
                {" "}· S{seasonNum}E{episodeNum} {currentEp.name}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setUseFallback((v) => !v)}
            aria-label="Mənbəni dəyiş"
            title="Alternativ mənbə"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goFullscreen} aria-label="Tam ekran">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Player */}
      <main className="flex-1 flex items-center justify-center bg-black">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="relative w-full aspect-video bg-black">
            {src ? (
              <iframe
                ref={iframeRef}
                key={src}
                src={src}
                title={title || "Video"}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground p-6 text-center">
                Mənbə tapılmadı
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer controls */}
      <footer className="px-3 sm:px-6 py-4 bg-background/95 border-t border-border/40 space-y-4">
        {isTv && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 max-w-5xl mx-auto w-full">
            <div className="flex gap-2 flex-1">
              <Select value={String(seasonNum)} onValueChange={(v) => navigate(`/watch/tv/${mediaId}/${v}/1`)}>
                <SelectTrigger className="flex-1 sm:max-w-[180px]">
                  <SelectValue placeholder="Mövsüm" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.season_number)}>
                      Mövsüm {s.season_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(episodeNum)}
                onValueChange={(v) => navigate(`/watch/tv/${mediaId}/${seasonNum}/${v}`)}
              >
                <SelectTrigger className="flex-1 sm:max-w-[220px]">
                  <SelectValue placeholder="Epizod" />
                </SelectTrigger>
                <SelectContent>
                  {episodes.map((e: any) => (
                    <SelectItem key={e.id} value={String(e.episode_number)}>
                      E{e.episode_number} · {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={episodeNum <= 1}
                onClick={() => navigate(`/watch/tv/${mediaId}/${seasonNum}/${episodeNum - 1}`)}
                className="flex-1 sm:flex-none gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Əvvəlki
              </Button>
              <Button
                size="sm"
                disabled={!nextEp && !seasons.find((s: any) => s.season_number === seasonNum + 1)}
                onClick={goNext}
                className="flex-1 sm:flex-none gap-1"
              >
                Növbəti <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        <div className="text-center">
          <Link
            to={isTv ? `/tv/${mediaId}` : `/movie/${mediaId}`}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            ← Detal səhifəsinə qayıt
          </Link>
        </div>
        <p className="text-[10px] text-center text-muted-foreground/70 max-w-2xl mx-auto">
          Video üçüncü tərəf provayder (VidSrc) tərəfindən təqdim olunur. Oynanmırsa
          yenilə düyməsinə basaraq alternativ mənbəni sınayın.
        </p>
      </footer>
    </div>
  );
};

export default WatchPage;
