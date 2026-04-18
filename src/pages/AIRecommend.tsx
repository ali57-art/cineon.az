import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Bot, Sparkles, Loader2, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  title: string;
  year: string;
  description: string;
}

const MOOD_KEYS = [
  "moodFun",
  "moodDrama",
  "moodAction",
  "moodHorror",
  "moodSciFi",
  "moodRomance",
  "moodThink",
  "moodFamily",
  "moodClassic",
  "moodShort",
] as const;

const AIRecommend = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const addMood = (label: string) => {
    setPrompt((prev) => (prev ? `${prev} ${label}` : label).trim());
  };

  const handleSubmit = async () => {
    const trimmed = prompt.trim();
    if (trimmed.length < 5) {
      toast({
        title: t("error", language),
        description: t("promptTooShort", language),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setMessage("");
    setRecommendations([]);

    try {
      const { data, error } = await supabase.functions.invoke("ai-recommendations", {
        body: { prompt: trimmed, language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setMessage(data?.message ?? "");
      setRecommendations(Array.isArray(data?.recommendations) ? data.recommendations : []);

      toast({
        title: t("success", language),
        description: t("aiRecommendationsReceived", language),
      });
    } catch (err) {
      console.error("AI recommend error:", err);
      toast({
        title: t("error", language),
        description: err instanceof Error ? err.message : "AI error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessage("");
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 shadow-glow">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground tracking-wide">
              {t("aiRecommendTitle", language)}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              {t("aiRecommendSubtitle", language)}
            </p>
          </div>

          {/* Input */}
          <Card className="p-5 md:p-6 bg-card border-border space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("aiPromptPlaceholder", language)}
              className="min-h-[140px] resize-none text-base border-2 focus-visible:border-primary"
              maxLength={1000}
              disabled={loading}
            />

            {/* Mood chips */}
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {t("quickPicks", language)}
              </p>
              <div className="flex flex-wrap gap-2">
                {MOOD_KEYS.map((key) => {
                  const label = t(key, language);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => addMood(label)}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-full bg-muted hover:bg-primary/20 hover:border-primary border border-border text-sm transition-colors disabled:opacity-50"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || prompt.trim().length < 5}
              size="lg"
              className="w-full gap-2 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("aiThinking", language)}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t("askAI", language)}
                </>
              )}
            </Button>
          </Card>

          {/* Results */}
          {(recommendations.length > 0 || message) && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-foreground tracking-wide flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t("aiResultTitle", language)}
                </h2>
                <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  {t("askAgain", language)}
                </Button>
              </div>

              {message && (
                <p className="text-muted-foreground italic border-l-2 border-primary pl-4">
                  {message}
                </p>
              )}

              <div className="grid gap-3">
                {recommendations.map((rec, idx) => (
                  <Card
                    key={`${rec.title}-${idx}`}
                    className="p-4 md:p-5 bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl text-foreground tracking-wide">
                          {rec.title}{" "}
                          {rec.year && (
                            <span className="font-mono text-sm text-muted-foreground">
                              ({rec.year})
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/movies?search=${encodeURIComponent(rec.title)}`)
                        }
                        className="gap-1.5 shrink-0"
                      >
                        <Search className="w-4 h-4" />
                        {t("search", language)}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIRecommend;
