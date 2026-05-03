import { useState } from "react";
import Header from "@/components/Header";
import MediaGrid from "@/components/MediaGrid";
import { useDiscoverTV, useTVGenres } from "@/hooks/useMovies";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SORTS = [
  { v: "popularity.desc", l: "Populyarlıq" },
  { v: "vote_average.desc", l: "Reytinq" },
  { v: "first_air_date.desc", l: "Ən yeni" },
];

const Series = () => {
  const [genre, setGenre] = useState<string>("all");
  const [sort, setSort] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const genres = useTVGenres();
  const params: Record<string, string | number> = { sort_by: sort, page, "vote_count.gte": 50 };
  if (genre !== "all") params.with_genres = genre;
  const q = useDiscoverTV(params);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-3xl md:text-4xl">Seriallar</h1>
          <div className="flex gap-2">
            <Select value={genre} onValueChange={(v) => { setGenre(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Janr" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün janrlar</SelectItem>
                {genres.data?.genres?.map((g: any) => (
                  <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SORTS.map(s => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <MediaGrid items={q.data?.results} loading={q.isLoading} fallbackType="tv" />

        <div className="flex justify-center gap-3 pt-6">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Əvvəlki</Button>
          <span className="self-center text-sm text-muted-foreground">Səhifə {page}</span>
          <Button variant="outline" onClick={() => setPage(p => p + 1)}>Sonrakı</Button>
        </div>
      </main>
    </div>
  );
};

export default Series;
