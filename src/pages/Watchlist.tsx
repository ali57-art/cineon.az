import Header from "@/components/Header";
import MediaGrid from "@/components/MediaGrid";
import { useWatchlist } from "@/hooks/useWatchlist";

const Watchlist = () => {
  const { list } = useWatchlist();
  const items = (list.data ?? []).map((w) => ({
    id: w.media_id,
    title: w.title,
    poster_path: w.poster,
    backdrop_path: w.poster,
    vote_average: 0,
    media_type: w.media_type,
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="font-display text-3xl md:text-4xl">İzləmə Siyahısı</h1>
        <MediaGrid items={items} loading={list.isLoading} emptyText="Siyahın boşdur" showType />
      </main>
    </div>
  );
};

export default Watchlist;
