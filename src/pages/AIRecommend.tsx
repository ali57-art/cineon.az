import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Sparkles,
  Loader2,
  Search,
  RotateCcw,
  Laugh,
  CloudRain,
  Flame,
  Ghost,
  Rocket,
  Heart,
  Brain,
  Users,
  Drama,
  Zap,
  Film,
  Tv,
  LayoutGrid,
  ArrowUp,
  Wand2,
  Clock,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Recommendation {
  title: string;
  year: string;
  description: string;
  type?: "movie" | "series";
}

type ContentType = "movie" | "series" | "both";

const MOODS: { key: string; icon: LucideIcon }[] = [
  { key: "moodFun", icon: Laugh },
  { key: "moodDrama", icon: CloudRain },
  { key: "moodAction", icon: Flame },
  { key: "moodHorror", icon: Ghost },
  { key: "moodSciFi", icon: Rocket },
  { key: "moodRomance", icon: Heart },
  { key: "moodThink", icon: Brain },
  { key: "moodFamily", icon: Users },
  { key: "moodClassic", icon: Drama },
  { key: "moodShort", icon: Zap },
];

const RECENT_KEY = "cineon_recent_prompts";

const AIRecommend = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState<ContentType>("movie");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);

  // Load recent prompts
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw).slice(0, 5));
    } catch { /* ignore */ }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [prompt]);

  // Smooth scroll to results
  useEffect(() => {
    if (recommendations.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [recommendations.length]);

  const saveRecent = (p: string) => {
    try {
      const next = [p, ...recent.filter((x) => x !== p)].slice(0, 5);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
  };

  const addMood = (label: string) => {
    setPrompt((prev) => (prev ? `${prev} ${label}` : label).trim());
    textareaRef.current?.focus();
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
        body: { prompt: trimmed, language, type: contentType },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setMessage(data?.message ?? "");
      const recs = Array.isArray(data?.recommendations) ? data.recommendations : [];
      setRecommendations(recs);
      saveRecent(trimmed);

      if (recs.length > 0) {
        toast({
          title: t("success", language),
          description: t("aiRecommendationsReceived", language),
        });
      }
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
    setPrompt("");
    textareaRef.current?.focus();
  };

  const goSearch = (rec: Recommendation) => {
    const isSeries = rec.type === "series" || (contentType === "series" && !rec.type);
    const path = isSeries ? "/series" : "/movies";
    navigate(`${path}?search=${encodeURIComponent(rec.title)}`);
  };

  const typeOptions: { value: ContentType; label: string; icon: LucideIcon }[] = [
    { value: "movie", label: t("typeMovie", language), icon: Film },
    { value: "series", label: t("typeSeries", language), icon: Tv },
    { value: "both", label: t("typeBoth", language), icon: LayoutGrid },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Cinematic background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.18),transparent_60%)]" />
        {/* Secondary glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_30%,hsl(280_60%_50%/0.08),transparent_70%)]" />
        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 2px, hsl(var(--foreground)) 3px)`,
          }}
        />
      </div>

      <Header />
      <Navigation />

      <main className="flex-1 relative z-10">
        {/* HERO + INPUT */}
        <section className="container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary">
                {t("aiPoweredBadge", language)}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-foreground">
              {t("aiHeroLine1", language)}
              <br />
              <span className="text-gradient-primary">{t("aiHeroLine2", language)}</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t("aiHeroSubtitle", language)}
            </p>
          </div>

          {/* INPUT BOX (ChatGPT-style) */}
          <div className="max-w-3xl mx-auto mt-10 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div
              className={cn(
                "relative rounded-2xl border-2 bg-card/80 backdrop-blur-xl transition-all duration-300",
                focused
                  ? "border-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15),0_20px_60px_-15px_hsl(var(--primary)/0.4)]"
                  : "border-border shadow-card"
              )}
            >
              {/* Type selector — top */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-border/50">
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                  {typeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = contentType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setContentType(opt.value)}
                        disabled={loading}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">
                  {prompt.length}/1000
                </span>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={t("aiInputPlaceholder", language)}
                maxLength={1000}
                disabled={loading}
                rows={3}
                className="w-full bg-transparent border-0 outline-none resize-none px-5 py-4 text-base md:text-lg text-foreground placeholder:text-muted-foreground/60 leading-relaxed font-sans disabled:opacity-50"
              />

              {/* Bottom action row */}
              <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
                <span className="text-[10px] font-mono text-muted-foreground/70 hidden md:inline pl-2">
                  ⌘ + ↵ {t("toSend", language)}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  {prompt && (
                    <button
                      onClick={() => setPrompt("")}
                      disabled={loading}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      aria-label="Clear"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || prompt.trim().length < 5}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all",
                      "bg-gradient-to-br from-primary to-primary-deep text-primary-foreground",
                      "hover:shadow-[0_0_24px_hsl(var(--primary)/0.5)] hover:scale-[1.03]",
                      "active:scale-[0.97]",
                      "disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
                    )}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowUp className="w-4 h-4" />
                    )}
                    <span>{loading ? t("aiThinking", language) : t("getRecommendations", language)}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SUGGESTION CHIPS */}
            <div className="mt-6 space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground text-center">
                <Wand2 className="w-3 h-3 inline mr-1.5" />
                {t("quickPicks", language)}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {MOODS.map(({ key, icon: Icon }) => {
                  const label = t(key as Parameters<typeof t>[0], language);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => addMood(label)}
                      disabled={loading}
                      className={cn(
                        "group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full",
                        "bg-card/60 backdrop-blur-sm border border-border",
                        "text-sm text-foreground/80 font-medium",
                        "hover:border-primary/60 hover:bg-primary/10 hover:text-foreground",
                        "transition-colors disabled:opacity-50"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent searches */}
            {recent.length > 0 && !loading && recommendations.length === 0 && (
              <div className="mt-8 space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {t("recentSearches", language)}
                </p>
                <div className="flex flex-col gap-1.5">
                  {recent.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(r)}
                      className="text-left text-sm text-muted-foreground hover:text-foreground bg-card/40 hover:bg-card border border-border/50 hover:border-border rounded-lg px-3 py-2 transition-colors truncate"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* LOADING SKELETONS */}
        {loading && (
          <section className="container mx-auto px-4 pb-16">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <p className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
                  {t("analyzingTaste", language)}
                  <span className="inline-flex ml-2">
                    <span className="animate-bounce-slow">.</span>
                    <span className="animate-bounce-slow" style={{ animationDelay: "0.2s" }}>.</span>
                    <span className="animate-bounce-slow" style={{ animationDelay: "0.4s" }}>.</span>
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card/60 overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="aspect-[16/10] skeleton" />
                    <div className="p-5 space-y-3">
                      <div className="skeleton h-6 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                      <div className="space-y-2 pt-2">
                        <div className="skeleton h-3 w-full" />
                        <div className="skeleton h-3 w-5/6" />
                        <div className="skeleton h-3 w-4/6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RESULTS */}
        {!loading && recommendations.length > 0 && (
          <section ref={resultsRef} className="container mx-auto px-4 pb-20 scroll-mt-20">
            <div className="max-w-5xl mx-auto">
              {/* Section header */}
              <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary mb-2">
                    <Sparkles className="w-3 h-3 inline mr-1.5" />
                    {recommendations.length} {t("matchesFound", language)}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    {t("aiResultTitle", language)}
                  </h2>
                </div>
                <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  {t("askAgain", language)}
                </Button>
              </div>

              {/* AI message */}
              {message && (
                <div className="mb-8 p-5 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-sm">
                  <p className="text-foreground/90 italic leading-relaxed">
                    <span className="text-primary font-mono text-xs uppercase tracking-widest mr-2">AI:</span>
                    {message}
                  </p>
                </div>
              )}

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendations.map((rec, idx) => {
                  const isSeries =
                    rec.type === "series" || (contentType === "series" && !rec.type);
                  const TypeIcon = isSeries ? Tv : Film;
                  return (
                    <article
                      key={`${rec.title}-${idx}`}
                      className="group relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-primary/60 transition-colors animate-fade-up cursor-pointer"
                      style={{ animationDelay: `${idx * 80}ms` }}
                      onClick={() => goSearch(rec)}
                    >
                      {/* Decorative top */}
                      <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-primary/20 via-card to-card">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.3),transparent_60%)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TypeIcon
                            className="w-16 h-16 text-primary/30 group-hover:scale-110 group-hover:text-primary/50 transition-transform duration-500"
                            strokeWidth={1.2}
                          />
                        </div>
                        {/* Number badge */}
                        <div className="absolute top-3 left-3 font-display text-3xl font-bold text-foreground/20 leading-none">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        {/* Type badge */}
                        <Badge
                          variant="secondary"
                          className="absolute top-3 right-3 gap-1 bg-background/80 backdrop-blur-sm"
                        >
                          <TypeIcon className="w-3 h-3" />
                          {isSeries ? t("badgeSeries", language) : t("badgeMovie", language)}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {rec.title}
                          </h3>
                          {rec.year && (
                            <p className="font-mono text-xs text-muted-foreground mt-1">
                              {rec.year}
                            </p>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {rec.description}
                        </p>

                        <div className="pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goSearch(rec);
                            }}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                          >
                            <Search className="w-3.5 h-3.5" />
                            {t("viewDetails", language)}
                            <span className="transition-transform group-hover:translate-x-0.5">→</span>
                          </button>
                        </div>
                      </div>

                      {/* Hover glow */}
                      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_30px_hsl(var(--primary)/0.15)]" />
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* EMPTY STATE — when no search yet */}
        {!loading && recommendations.length === 0 && (
          <section className="container mx-auto px-4 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {t("examplePrompts", language)}
                </p>
                <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
                  {t("needInspiration", language)}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  t("examplePrompt1", language),
                  t("examplePrompt2", language),
                  t("examplePrompt3", language),
                  t("examplePrompt4", language),
                ].map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(ex);
                      textareaRef.current?.focus();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group text-left p-4 rounded-xl border border-border bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                        "{ex}"
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AIRecommend;
