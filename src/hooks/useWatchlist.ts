import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { MediaType } from "@/services/tmdb";

export interface WatchlistItem {
  id: string;
  user_id: string;
  media_id: number;
  media_type: MediaType;
  title: string;
  poster: string | null;
  year: string | null;
  added_at: string;
}

export const useWatchlist = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_watchlist")
        .select("*")
        .eq("user_id", user.id)
        .not("media_id", "is", null)
        .order("added_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any as WatchlistItem[];
    },
    enabled: !!user,
  });

  const add = useMutation({
    mutationFn: async (item: Omit<WatchlistItem, "id" | "user_id" | "added_at">) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("user_watchlist").insert({
        user_id: user.id,
        media_id: item.media_id,
        media_type: item.media_type,
        title: item.title,
        poster: item.poster,
        year: item.year,
        // legacy zəruri sahələr
        imdb_id: `tmdb_${item.media_type}_${item.media_id}`,
        type: item.media_type,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Siyahıya əlavə olundu");
    },
    onError: (e: any) => toast.error(e.message ?? "Xəta baş verdi"),
  });

  const remove = useMutation({
    mutationFn: async ({ media_id, media_type }: { media_id: number; media_type: MediaType }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("user_watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("media_id", media_id)
        .eq("media_type", media_type);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Siyahıdan çıxarıldı");
    },
    onError: (e: any) => toast.error(e.message ?? "Xəta baş verdi"),
  });

  const isInWatchlist = (media_id: number, media_type: MediaType) =>
    !!list.data?.find((w) => w.media_id === media_id && w.media_type === media_type);

  return { list, add, remove, isInWatchlist };
};
