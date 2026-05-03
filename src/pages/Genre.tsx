import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import MediaGrid from "@/components/MediaGrid";
import { useDiscoverMovies, useDiscoverTV, useMovieGenres, useTVGenres } from "@/hooks/useMovies";
import { Button } from "@/components/ui/button";

const Genre = () => {
  const { type, id } = useParams<{ type: "movie" | "tv"; id: string }>();
  const [page, setPage] = useState(1);
  const isMovie = type === "movie";
  const moviesQ = useDiscoverMovies({ with_genres: Number(id), sort_by: "popularity.desc", page });
  const tvQ = useDiscoverTV({ with_genres: Number(id), sort_by: "popularity.desc", page });
  const q = isMovie ? moviesQ : tvQ;
  const movieGenres = useMovieGenres();
  const tvGenres = useTVGenres();
  const genreList = isMovie ? movieGenres.data?.genres : tvGenres.data?.genres;
  const name = genreList?.find((g: any) => g.id === Number(id))?.name ?? "";

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="font-display text-3xl md:text-4xl">{name} {isMovie ? "Filmlər" : "Seriallar"}</h1>
        <MediaGrid items={q.data?.results} loading={q.isLoading} fallbackType={isMovie ? "movie" : "tv"} />
        <div className="flex justify-center gap-3 pt-6">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Əvvəlki</Button>
          <span className="self-center text-sm text-muted-foreground">Səhifə {page}</span>
          <Button variant="outline" onClick={() => setPage(p => p + 1)}>Sonrakı</Button>
        </div>
      </main>
    </div>
  );
};

export default Genre;
