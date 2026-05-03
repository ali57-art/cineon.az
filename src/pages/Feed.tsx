import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Activity, Star, Eye, UserPlus, ListPlus } from "lucide-react";

const ICONS: Record<string, any> = {
  rated: Star,
  watched: Eye,
  followed: UserPlus,
  list_created: ListPlus,
};

const Feed = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: follows } = await supabase.from("follows").select("following_id").eq("follower_id", user.id);
      const ids = (follows ?? []).map((f: any) => f.following_id);
      if (!ids.length) { setItems([]); setLoading(false); return; }
      const { data } = await supabase.from("activity")
        .select("*")
        .in("user_id", ids)
        .order("created_at", { ascending: false })
        .limit(50);
      setItems(data ?? []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-4">
        <h1 className="font-display text-3xl">Aktivlik Axını</h1>

        {loading ? (
          <p className="text-muted-foreground">Yüklənir…</p>
        ) : !items.length ? (
          <div className="text-center py-16 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto opacity-40 mb-3" />
            Hələ heç bir aktivlik yoxdur. Bəzi istifadəçiləri izləməyə başla!
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((a) => {
              const Icon = ICONS[a.type] ?? Activity;
              return (
                <Card key={a.id} className="p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 grid place-items-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">İstifadəçi</span>{" "}
                      {a.type === "rated" && `bir ${a.payload.media_type === "tv" ? "seriala" : "filmə"} ${a.payload.rating}/10 verdi`}
                      {a.type === "watched" && `bir ${a.payload.media_type === "tv" ? "serial" : "film"} izlədi`}
                      {a.type === "followed" && "yeni biri izləməyə başladı"}
                      {a.type === "list_created" && `yeni siyahı yaratdı: ${a.payload.name}`}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleString("az-AZ")}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;
