import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Film, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AISimilarMoviesProps {
  title: string;
  genre: string;
  year: string;
}

interface MovieSuggestion {
  title: string;
  year: string;
  reason: string;
}

const AISimilarMovies = ({ title, genre, year }: AISimilarMoviesProps) => {
  const { language } = useLanguage();
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);

  const findSimilar = async () => {
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
      const { data, error } = await supabase.functions.invoke("ai-similar-movies", {
        body: { title, genre, year, language },
      });

      if (error) throw error;

      setSuggestions(data.suggestions);
      
      toast({
        title: t("success", language),
        description: "Bənzər filmlər tapıldı",
      });
    } catch (error) {
      console.error("AI similar movies error:", error);
      toast({
        title: t("error", language),
        description: "Bənzər filmlər tapılarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={findSimilar}
        disabled={loading || !isPro}
        className="w-full gap-2"
        variant={isPro ? "default" : "secondary"}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Film className="w-4 h-4" />
        )}
        Bənzər Filmlər {!isPro && "🔒"}
      </Button>

      {suggestions.length > 0 && (
        <div className="grid gap-3 animate-fade-in">
          {suggestions.map((movie, index) => (
            <Card key={index} className="p-3 bg-card/50 backdrop-blur-sm border-primary/20">
              <h4 className="font-semibold text-sm mb-1">
                {movie.title} ({movie.year})
              </h4>
              <p className="text-xs text-muted-foreground">{movie.reason}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISimilarMovies;
