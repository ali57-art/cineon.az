// Video provider — VidSrc embed (pulsuz, TMDB ID ilə işləyir)
// İstehsal üçün öz lisenziyalı CDN-iniz varsa bu faylı dəyişin.

export interface VideoSource {
  url: string | null;
  type: "hls" | "mp4" | "iframe" | "none";
  fallbackUrl?: string | null;
}

const PRIMARY = "https://vidsrc.xyz/embed";
const FALLBACK = "https://vidsrc.to/embed";

function withSub(url: string, lang: string) {
  // VidSrc altyazı dili parametri: ds_lang (ISO 639-1)
  return `${url}?ds_lang=${encodeURIComponent(lang)}`;
}

export const videoProvider = {
  getMovieSource(tmdbId: number, subLang: string = "az"): VideoSource {
    return {
      url: withSub(`${PRIMARY}/movie/${tmdbId}`, subLang),
      fallbackUrl: withSub(`${FALLBACK}/movie/${tmdbId}`, subLang),
      type: "iframe",
    };
  },
  getEpisodeSource(tmdbId: number, season: number, episode: number, subLang: string = "az"): VideoSource {
    return {
      url: withSub(`${PRIMARY}/tv/${tmdbId}/${season}/${episode}`, subLang),
      fallbackUrl: withSub(`${FALLBACK}/tv/${tmdbId}/${season}/${episode}`, subLang),
      type: "iframe",
    };
  },
  isConfigured(): boolean {
    return true;
  },
};
