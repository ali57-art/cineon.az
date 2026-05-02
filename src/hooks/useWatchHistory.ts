import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { MediaType } from "@/services/tmdb";

export const useWatchHistory = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const history = useQuery({
    queryKey: ["watchHistory", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("watch_history")
        .select("*")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const saveProgress = useMutation({
    mutationFn: async (input: {
      media_id: number;
      media_type: MediaType;
      season_number?: number | null;
      episode_number?: number | null;
      progress_seconds: number;
      duration_seconds: number;
      completed?: boolean;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("watch_history").upsert(
        {
          user_id: user.id,
          media_id: input.media_id,
          media_type: input.media_type,
          season_number: input.season_number ?? null,
          episode_number: input.episode_number ?? null,
          progress_seconds: input.progress_seconds,
          duration_seconds: input.duration_seconds,
          completed: input.completed ?? false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,media_id,media_type,season_number,episode_number" } as any,
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchHistory"] }),
  });

  return { history, saveProgress };
};
