// Video provider — VidSrc embed (pulsuz, TMDB ID ilə işləyir)
// İstehsal üçün öz lisenziyalı CDN-iniz varsa bu faylı dəyişin.

export interface VideoSource {
  url: string | null;
  type: "hls" | "mp4" | "iframe" | "none";
  fallbackUrl?: string | null;
}

const PRIMARY = "https://vidsrc.xyz/embed";
const FALLBACK = "https://vidsrc.to/embed";

export const videoProvider = {
  getMovieSource(tmdbId: number): VideoSource {
    return {
      url: `${PRIMARY}/movie/${tmdbId}`,
      fallbackUrl: `${FALLBACK}/movie/${tmdbId}`,
      type: "iframe",
    };
  },
  getEpisodeSource(tmdbId: number, season: number, episode: number): VideoSource {
    return {
      url: `${PRIMARY}/tv/${tmdbId}/${season}/${episode}`,
      fallbackUrl: `${FALLBACK}/tv/${tmdbId}/${season}/${episode}`,
      type: "iframe",
    };
  },
  isConfigured(): boolean {
    return true;
  },
};
