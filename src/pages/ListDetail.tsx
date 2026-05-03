import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { useListDetail } from "@/hooks/useLists";
import MediaGrid from "@/components/MediaGrid";
import { Card } from "@/components/ui/card";
import { Globe, Lock } from "lucide-react";

const ListDetail = () => {
  const { id } = useParams();
  const { list, items } = useListDetail(id);

  // Note: list_items only stores media_id/type/notes — full media metadata not joined here.
  // Render minimal info; ideally we'd fetch each from TMDB but skipping for performance.
  const grid = (items.data ?? []).map((it: any) => ({
    id: it.media_id,
    title: `#${it.media_id}`,
    poster_path: null,
    backdrop_path: null,
    vote_average: 0,
    media_type: it.media_type,
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        {list.data && (
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl">{list.data.name}</h1>
                {list.data.description && <p className="text-muted-foreground mt-2">{list.data.description}</p>}
              </div>
              {list.data.is_public ? <Globe className="w-5 h-5 text-muted-foreground" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
            </div>
          </Card>
        )}
        <MediaGrid items={grid} loading={items.isLoading} emptyText="Bu siyahı boşdur" showType />
      </main>
    </div>
  );
};

export default ListDetail;
