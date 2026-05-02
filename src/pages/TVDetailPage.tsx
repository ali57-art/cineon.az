import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTVDetails, useTVSeason } from "@/hooks/useMovies";
import { tmdb } from "@/services/tmdb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Plus, Check, Star, Calendar } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import EpisodeCard from "@/components/EpisodeCard";
import PersonCard from "@/components/PersonCard";
import MediaGrid from "@/components/MediaGrid";

const TVDetailPage = () => {
  const { id } = useParams();
  const tvId = Number(id);
  const { data, isLoading } = useTVDetails(tvId);
  const { add, remove, isInWatchlist } = useWatchlist();
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const seasonData = useTVSeason(tvId, selectedSeason);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Skeleton className="w-full h-[60vh]" />
      </div>
    );
  }

  const inList = isInWatchlist(tvId, "tv");
  const year = data.first_air_date ? new Date(data.first_air_date).getFullYear() : null;

  const onToggle = () => {
    if (inList) remove.mutate({ media_id: tvId, media_type: "tv" });
    else
      add.mutate({
        media_id: tvId,
        media_type: "tv",
        title: data.name,
        poster: data.poster_path,
        year: year ? String(year) : null,
      });
  };

  const seasons = (data.seasons ?? []).filter((s: any) => s.season_number > 0);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <Header />

      <section className="relative">
        <div className="absolute inset-0 h-[70vh]">
          <img src={tmdb.image.backdrop(data.backdrop_path)} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
        <div className="relative container mx-auto px-4 pt-12 pb-8">
          <div className="grid md:grid-cols-[260px_1fr] gap-8">
            <img
              src={tmdb.image.poster(data.poster_path, "w500")}
              alt={data.name}
              className="rounded-2xl shadow-float w-full max-w-[260px] mx-auto md:mx-0"
            />
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {data.genres?.map((g: any) => (
                  <Link key={g.id} to={`/genre/tv/${g.id}`} className="px-3 py-1 rounded-full bg-muted text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                    {g.name}
                  </Link>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-headline">{data.name}</h1>
              {data.tagline && <p className="text-lg italic text-muted-foreground">{data.tagline}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 font-semibold">
                  <Star className="w-4 h-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                  {data.vote_average?.toFixed(1)}
                </span>
                {year && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {year}</span>}
                <span>{data.number_of_seasons} mövsüm · {data.number_of_episodes} epizod</span>
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{data.status}</span>
              </div>
              <p className="text-base text-foreground/90 max-w-2xl">{data.overview}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="gap-2 rounded-full">
                  <Link to={`/watch/tv/${tvId}/1/1`}><Play className="w-4 h-4 fill-current" /> İzlə</Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2 rounded-full" onClick={onToggle}>
                  {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {inList ? "Siyahıdadır" : "Siyahıya əlavə et"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Epizodlar</h2>
          <Select value={String(selectedSeason)} onValueChange={(v) => setSelectedSeason(Number(v))}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {seasons.map((s: any) => (
                <SelectItem key={s.id} value={String(s.season_number)}>
                  Mövsüm {s.season_number} ({s.episode_count} epizod)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          {seasonData.isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
            : seasonData.data?.episodes?.map((ep: any) => <EpisodeCard key={ep.id} tvId={tvId} episode={ep} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cast">
          <TabsList>
            <TabsTrigger value="cast">Aktyorlar</TabsTrigger>
            <TabsTrigger value="similar">Oxşar</TabsTrigger>
          </TabsList>
          <TabsContent value="cast" className="mt-6">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {data.credits?.cast?.slice(0, 20).map((p: any) => <PersonCard key={p.id} person={p} />)}
            </div>
          </TabsContent>
          <TabsContent value="similar" className="mt-6">
            <MediaGrid items={data.similar?.results} fallbackType="tv" />
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default TVDetailPage;
