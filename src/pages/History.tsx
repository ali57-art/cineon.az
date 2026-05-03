import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play } from "lucide-react";

const History = () => {
  const { history } = useWatchHistory();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="font-display text-3xl md:text-4xl">İzləmə Tarixçəsi</h1>

        {history.isLoading ? (
          <p className="text-muted-foreground">Yüklənir…</p>
        ) : !history.data?.length ? (
          <p className="text-muted-foreground">Hələ bir şey izləməmisən.</p>
        ) : (
          <div className="space-y-3">
            {history.data.map((h: any) => {
              const pct = h.duration_seconds ? Math.min(100, (h.progress_seconds / h.duration_seconds) * 100) : 0;
              const href = h.media_type === "tv" ? `/tv/${h.media_id}` : `/movie/${h.media_id}`;
              return (
                <Card key={h.id} className="p-4 flex items-center gap-4">
                  <Link to={href} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center"><Play className="w-4 h-4 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {h.media_type === "tv" ? `Serial #${h.media_id}` : `Film #${h.media_id}`}
                        {h.season_number != null && ` • S${h.season_number}E${h.episode_number}`}
                      </div>
                      <Progress value={pct} className="mt-2 h-1" />
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {h.completed ? "Tamamlandı" : `${Math.round(pct)}%`}
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
