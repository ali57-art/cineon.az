import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useFollow = (targetUserId: string | undefined) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const isFollowing = useQuery({
    queryKey: ["follow", user?.id, targetUserId],
    queryFn: async () => {
      if (!user || !targetUserId) return false;
      const { data } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!targetUserId && user?.id !== targetUserId,
  });

  const counts = useQuery({
    queryKey: ["followCounts", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return { followers: 0, following: 0 };
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", targetUserId),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", targetUserId),
      ]);
      return { followers: followers ?? 0, following: following ?? 0 };
    },
    enabled: !!targetUserId,
  });

  const toggle = useMutation({
    mutationFn: async () => {
      if (!user || !targetUserId) throw new Error("Auth required");
      if (isFollowing.data) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetUserId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: targetUserId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["follow"] });
      qc.invalidateQueries({ queryKey: ["followCounts"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return { isFollowing, counts, toggle };
};
