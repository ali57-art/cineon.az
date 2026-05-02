import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { MediaType } from "@/services/tmdb";

export const useRating = (media_id: number | undefined, media_type: MediaType) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const myRating = useQuery({
    queryKey: ["rating", user?.id, media_id, media_type],
    queryFn: async () => {
      if (!user || !media_id) return null;
      const { data } = await supabase
        .from("ratings")
        .select("*")
        .eq("user_id", user.id)
        .eq("media_id", media_id)
        .eq("media_type", media_type)
        .maybeSingle();
      return data;
    },
    enabled: !!user && !!media_id,
  });

  const rate = useMutation({
    mutationFn: async (input: { rating: number; review?: string; spoiler?: boolean }) => {
      if (!user || !media_id) throw new Error("Auth or media missing");
      const { error } = await supabase.from("ratings").upsert(
        {
          user_id: user.id,
          media_id,
          media_type,
          rating: input.rating,
          review: input.review ?? null,
          spoiler: input.spoiler ?? false,
        },
        { onConflict: "user_id,media_id,media_type" } as any,
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rating"] });
      toast.success("Reytinq yadda saxlanıldı");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return { myRating, rate };
};
