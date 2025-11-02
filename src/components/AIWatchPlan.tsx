import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DayPlan {
  day: string;
  title: string;
  genre: string;
  reason: string;
}

const AIWatchPlan = () => {
  const { language } = useLanguage();
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<DayPlan[]>([]);

  const createPlan = async () => {
    if (!isPro) {
      toast({
        title: t("premiumFeature", language),
        description: t("upgradeToPro", language),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const preferences = {
        genres: ["Action", "Drama", "Comedy"],
        mood: "varied",
        duration: "week"
      };

      const { data, error } = await supabase.functions.invoke("ai-watch-plan", {
        body: { preferences, language },
      });

      if (error) throw error;

      setPlan(data.plan);
      
      toast({
        title: t("success", language),
        description: "Həftəlik izləmə planı yaradıldı",
      });
    } catch (error) {
      console.error("AI watch plan error:", error);
      toast({
        title: t("error", language),
        description: "İzləmə planı yaradılarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={createPlan}
        disabled={loading || !isPro}
        className="w-full gap-2"
        variant={isPro ? "default" : "secondary"}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Calendar className="w-4 h-4" />
        )}
        Həftəlik Plan {!isPro && "🔒"}
      </Button>

      {plan.length > 0 && (
        <div className="grid gap-3 animate-fade-in">
          {plan.map((day, index) => (
            <Card key={index} className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{day.day}</h4>
                <span className="text-xs text-muted-foreground">{day.genre}</span>
              </div>
              <p className="font-medium text-sm mb-1">{day.title}</p>
              <p className="text-xs text-muted-foreground">{day.reason}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIWatchPlan;
