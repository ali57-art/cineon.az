import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { MediaType } from "@/services/tmdb";

export const useLists = (userId?: string) => {
  const { user } = useAuth();
  const targetId = userId ?? user?.id;
  const qc = useQueryClient();

  const lists = useQuery({
    queryKey: ["lists", targetId],
    queryFn: async () => {
      if (!targetId) return [];
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("user_id", targetId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!targetId,
  });

  const create = useMutation({
    mutationFn: async (input: { name: string; description?: string; is_public?: boolean }) => {
      if (!user) throw new Error("Auth required");
      const { data, error } = await supabase
        .from("lists")
        .insert({ user_id: user.id, ...input })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lists"] });
      toast.success("Siyahı yaradıldı");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return { lists, create };
};

export const useListDetail = (listId: string | undefined) => {
  const qc = useQueryClient();
  const { user } = useAuth();

  const list = useQuery({
    queryKey: ["list", listId],
    queryFn: async () => {
      if (!listId) return null;
      const { data, error } = await supabase.from("lists").select("*").eq("id", listId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!listId,
  });

  const items = useQuery({
    queryKey: ["listItems", listId],
    queryFn: async () => {
      if (!listId) return [];
      const { data } = await supabase
        .from("list_items")
        .select("*")
        .eq("list_id", listId)
        .order("added_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!listId,
  });

  const addItem = useMutation({
    mutationFn: async (input: { media_id: number; media_type: MediaType; notes?: string }) => {
      if (!listId) throw new Error("No list");
      const { error } = await supabase.from("list_items").insert({ list_id: listId, ...input });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listItems", listId] });
      toast.success("Əlavə olundu");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("list_items").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listItems", listId] }),
  });

  return { list, items, addItem, removeItem };
};
