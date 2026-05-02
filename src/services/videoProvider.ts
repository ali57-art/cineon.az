// Legal video provider konfiqurasiyası
// Real provider URL pattern-i bura əlavə edin (məsələn lisenziyalı HLS stream)
//
// Nümunə:
//   movie:  https://your-cdn.com/stream/movie/{tmdb_id}/index.m3u8
//   tv:     https://your-cdn.com/stream/tv/{tmdb_id}/{season}/{episode}/index.m3u8
//
// Hazırda placeholder qaytarır — istifadəçiyə "Provider konfiqurasiya edilməyib" mesajı göstərilir.

export interface VideoSource {
  url: string | null;
  type: "hls" | "mp4" | "iframe" | "none";
}

export const videoProvider = {
  getMovieSource(tmdbId: number): VideoSource {
    // TODO: legal provider URL-iniz ilə əvəz edin
    return { url: null, type: "none" };
  },
  getEpisodeSource(tmdbId: number, season: number, episode: number): VideoSource {
    // TODO: legal provider URL-iniz ilə əvəz edin
    return { url: null, type: "none" };
  },
  isConfigured(): boolean {
    return false;
  },
};
