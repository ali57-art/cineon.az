import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSubscription = () => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporarily making Pro free for all logged-in users
    if (!user) {
      setIsPro(false);
      setLoading(false);
      return;
    }

    setIsPro(true);
    setLoading(false);
  }, [user]);

  return { isPro, loading };
};
