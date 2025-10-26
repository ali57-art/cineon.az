import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSubscription = () => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsPro(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_subscriptions")
          .select("subscription_type, is_active")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setIsPro(data?.subscription_type === "pro" && data?.is_active === true);
      } catch (error) {
        console.error("Subscription check error:", error);
        setIsPro(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  return { isPro, loading };
};
