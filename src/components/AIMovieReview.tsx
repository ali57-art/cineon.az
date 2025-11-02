import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIMovieReviewProps {
  title: string;
  year: string;
  plot?: string;
}

const AIMovieReview = ({ title, year, plot }: AIMovieReviewProps) => {
  const { language } = useLanguage();
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<string>("");

  const generateReview = async () => {
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
      const { data, error } = await supabase.functions.invoke("ai-movie-review", {
        body: { title, year, plot, language },
      });

      if (error) throw error;

      setReview(data.review);
      
      toast({
        title: t("success", language),
        description: "AI rəyi yaradıldı",
      });
    } catch (error) {
      console.error("AI review error:", error);
      toast({
        title: t("error", language),
        description: "AI rəyi yaradılarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generateReview}
        disabled={loading || !isPro}
        className="w-full gap-2"
        variant={isPro ? "default" : "secondary"}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        AI Rəyi {!isPro && "🔒"}
      </Button>

      {review && (
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20 animate-fade-in">
          <p className="text-sm leading-relaxed">{review}</p>
        </Card>
      )}
    </div>
  );
};

export default AIMovieReview;
