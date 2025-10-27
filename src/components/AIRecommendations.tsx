import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendationsProps {
  genre?: string;
  type?: string;
}

interface Recommendation {
  title: string;
  description: string;
}

const AIRecommendations = ({ genre, type }: AIRecommendationsProps) => {
  const { language } = useLanguage();
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const getRecommendations = async () => {
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
      const { data, error } = await supabase.functions.invoke("ai-recommendations", {
        body: { genre, language, type },
      });

      if (error) throw error;

      const parsed = JSON.parse(data.recommendations);
      setRecommendations(parsed);
      
      toast({
        title: t("success", language),
        description: t("aiRecommendationsReceived", language),
      });
    } catch (error) {
      console.error("AI recommendations error:", error);
      toast({
        title: t("error", language),
        description: "AI tövsiyələri alınarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={getRecommendations}
        disabled={loading || !isPro}
        className="w-full gap-2"
        variant={isPro ? "default" : "secondary"}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {t("aiRecommendations", language)} {!isPro && "🔒"}
      </Button>

      {recommendations.length > 0 && (
        <div className="grid gap-4 animate-fade-in">
          {recommendations.map((rec, index) => (
            <Card key={index} className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
              <h4 className="font-semibold text-lg mb-2">{rec.title}</h4>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;