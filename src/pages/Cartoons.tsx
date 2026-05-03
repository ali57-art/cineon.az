import { useState } from "react";
import Header from "@/components/Header";
import MediaGrid from "@/components/MediaGrid";
import { useDiscoverMovies, useDiscoverTV } from "@/hooks/useMovies";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Cartoons = () => {
  const [tab, setTab] = useState<"movie" | "tv">("movie");
  const [page, setPage] = useState(1);
  const moviesQ = useDiscoverMovies({ with_genres: 16, sort_by: "popularity.desc", page });
  const tvQ = useDiscoverTV({ with_genres: 16, sort_by: "popularity.desc", page });
  const q = tab === "movie" ? moviesQ : tvQ;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <h1 className="font-display text-3xl md:text-4xl">Multfilmlər</h1>
          <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setPage(1); }}>
            <TabsList>
              <TabsTrigger value="movie">Filmlər</TabsTrigger>
              <TabsTrigger value="tv">Seriallar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <MediaGrid items={q.data?.results} loading={q.isLoading} fallbackType={tab} />

        <div className="flex justify-center gap-3 pt-6">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Əvvəlki</Button>
          <span className="self-center text-sm text-muted-foreground">Səhifə {page}</span>
          <Button variant="outline" onClick={() => setPage(p => p + 1)}>Sonrakı</Button>
        </div>
      </main>
    </div>
  );
};

export default Cartoons;
