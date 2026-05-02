import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMovieDetails } from "@/hooks/useMovies";
import { tmdb, normalizeMedia } from "@/services/tmdb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Plus, Check, Star, Clock, Calendar } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useRating } from "@/hooks/useRatings";
import { useAuth } from "@/contexts/AuthContext";
import RatingStars from "@/components/RatingStars";
import TrailerModal from "@/components/TrailerModal";
import PersonCard from "@/components/PersonCard";
import MediaGrid from "@/components/MediaGrid";

const MovieDetailPage = () => {
  const { id } = useParams();
  const movieId = Number(id);
  const { data, isLoading } = useMovieDetails(movieId);
  const { add, remove, isInWatchlist } = useWatchlist();
  const { user } = useAuth();
  const { myRating, rate } = useRating(movieId, "movie");
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Skeleton className="w-full h-[60vh]" />
      </div>
    );
  }

  const trailer = data.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  const inList = isInWatchlist(movieId, "movie");
  const year = data.release_date ? new Date(data.release_date).getFullYear() : null;

  const onToggle = () => {
    if (inList) remove.mutate({ media_id: movieId, media_type: "movie" });
    else
      add.mutate({
        media_id: movieId,
        media_type: "movie",
        title: data.title,
        poster: data.poster_path,
        year: year ? String(year) : null,
      });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <Header />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 h-[70vh]">
          <img src={tmdb.image.backdrop(data.backdrop_path)} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
        <div className="relative container mx-auto px-4 pt-12 pb-8">
          <div className="grid md:grid-cols-[260px_1fr] gap-8">
            <img
              src={tmdb.image.poster(data.poster_path, "w500")}
              alt={data.title}
              className="rounded-2xl shadow-float w-full max-w-[260px] mx-auto md:mx-0"
            />
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {data.genres?.map((g: any) => (
                  <Link
                    key={g.id}
                    to={`/genre/movie/${g.id}`}
                    className="px-3 py-1 rounded-full bg-muted text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-headline">{data.title}</h1>
              {data.tagline && <p className="text-lg italic text-muted-foreground">{data.tagline}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 font-semibold">
                  <Star className="w-4 h-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                  {data.vote_average?.toFixed(1)} ({data.vote_count})
                </span>
                {year && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {year}</span>}
                {data.runtime ? <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {data.runtime} dəq</span> : null}
              </div>
              <p className="text-base text-foreground/90 max-w-2xl">{data.overview}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="gap-2 rounded-full">
                  <Link to={`/watch/movie/${movieId}`}><Play className="w-4 h-4 fill-current" /> İzlə</Link>
                </Button>
                {trailer && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="gap-2 rounded-full"
                    onClick={() => {
                      setTrailerKey(trailer.key);
                      setTrailerOpen(true);
                    }}
                  >
                    <Play className="w-4 h-4" /> Trailer
                  </Button>
                )}
                <Button variant="outline" size="lg" className="gap-2 rounded-full" onClick={onToggle}>
                  {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {inList ? "Siyahıdadır" : "Siyahıya əlavə et"}
                </Button>
              </div>
              {user && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-1">Sənin reytinqin:</p>
                  <RatingStars
                    value={myRating.data?.rating ?? 0}
                    onRate={(v) => rate.mutate({ rating: v })}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cast" className="w-full">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="cast">Aktyorlar</TabsTrigger>
            <TabsTrigger value="videos">Videolar</TabsTrigger>
            <TabsTrigger value="similar">Oxşar</TabsTrigger>
            <TabsTrigger value="reviews">Rəylər</TabsTrigger>
            <TabsTrigger value="info">Məlumatlar</TabsTrigger>
          </TabsList>

          <TabsContent value="cast" className="mt-6">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {data.credits?.cast?.slice(0, 20).map((p: any) => <PersonCard key={p.id} person={p} />)}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.videos?.results?.filter((v: any) => v.site === "YouTube").map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setTrailerKey(v.key);
                    setTrailerOpen(true);
                  }}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-muted"
                >
                  <img src={`https://i.ytimg.com/vi/${v.key}/hqdefault.jpg`} alt={v.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60">
                    <Play className="w-12 h-12 text-white fill-white" />
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="similar" className="mt-6">
            <MediaGrid items={data.similar?.results} fallbackType="movie" />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4 max-w-3xl">
              {data.reviews?.results?.length ? (
                data.reviews.results.map((r: any) => (
                  <div key={r.id} className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{r.author}</span>
                      {r.author_details?.rating && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-3 h-3 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                          {r.author_details.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-6">{r.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Hələ rəy yoxdur.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm max-w-3xl">
              {data.budget > 0 && <div><dt className="text-muted-foreground">Büdcə</dt><dd className="font-semibold">${data.budget.toLocaleString()}</dd></div>}
              {data.revenue > 0 && <div><dt className="text-muted-foreground">Gəlir</dt><dd className="font-semibold">${data.revenue.toLocaleString()}</dd></div>}
              {data.original_language && <div><dt className="text-muted-foreground">Dil</dt><dd className="font-semibold uppercase">{data.original_language}</dd></div>}
              {data.status && <div><dt className="text-muted-foreground">Status</dt><dd className="font-semibold">{data.status}</dd></div>}
              {data.production_companies?.length > 0 && (
                <div className="col-span-2 md:col-span-3">
                  <dt className="text-muted-foreground mb-1">İstehsalçılar</dt>
                  <dd>{data.production_companies.map((c: any) => c.name).join(", ")}</dd>
                </div>
              )}
            </dl>
          </TabsContent>
        </Tabs>
      </section>

      <TrailerModal videoKey={trailerKey} open={trailerOpen} onOpenChange={setTrailerOpen} />
      <Footer />
    </div>
  );
};

export default MovieDetailPage;
