import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Swords, Star, Check, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { getTodayDuel, getCommunityResult } from "@/data/duels";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cineon_duel_votes";

interface Vote {
  date: string;
  choice: "left" | "right";
}

const useCountdown = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  const diff = tomorrow.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h}s ${m}d ${s}san`;
};

const Duel = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const duel = useMemo(() => getTodayDuel(), []);
  const community = useMemo(() => getCommunityResult(duel.date), [duel.date]);
  const countdown = useCountdown();

  const [vote, setVote] = useState<Vote | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Vote = JSON.parse(raw);
        if (parsed.date === duel.date) setVote(parsed);
      } catch {}
    }
  }, [duel.date]);

  const handleVote = (choice: "left" | "right") => {
    if (vote) return;
    const v: Vote = { date: duel.date, choice };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    setVote(v);
  };

  const renderCard = (side: "left" | "right") => {
    const m = side === "left" ? duel.left : duel.right;
    const isPicked = vote?.choice === side;
    const isLost = vote && !isPicked;

    return (
      <button
        onClick={() => handleVote(side)}
        disabled={!!vote}
        className={cn(
          "group relative rounded-2xl overflow-hidden border bg-card text-left transition-all duration-300",
          !vote && "hover:scale-[1.02] hover:border-primary hover:shadow-elegant cursor-pointer",
          isPicked && "border-primary shadow-elegant",
          isLost && "opacity-40",
          !vote && "border-border"
        )}
      >
        <div className="aspect-[2/3] relative bg-secondary">
          {m.poster && m.poster !== "N/A" ? (
            <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No poster
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-background via-background/80 to-transparent">
            <h3 className="font-display text-lg md:text-2xl tracking-wide text-foreground mb-1">
              {m.title}
            </h3>
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground font-mono">
              <span>{m.year}</span>
              <span className="flex items-center gap-1 text-[hsl(var(--gold))]">
                <Star className="w-3.5 h-3.5 fill-current" />
                {m.rating}
              </span>
            </div>
          </div>
          {isPicked && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1">
              <Check className="w-3 h-3" />
              {t("youChose", language)}
            </div>
          )}
        </div>
        {!vote && (
          <div className="px-4 py-3 border-t border-border text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {t("pickThis", language)}
          </div>
        )}
      </button>
    );
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 py-10 space-y-10">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Swords className="w-3.5 h-3.5" />
            {t("dailyDuel", language)}
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide text-foreground">
            {t("whichOne", language)}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("duelSubtitle", language)}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-mono text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {countdown}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 md:gap-6 items-stretch max-w-4xl mx-auto relative">
          {renderCard("left")}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <span className="font-display text-3xl md:text-5xl text-primary px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-primary/40">
              VS
            </span>
          </div>
          {renderCard("right")}
        </div>

        {vote && (
          <section className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 animate-fade-in">
            <h3 className="font-display text-xl tracking-wide mb-4">
              {t("communityChose", language)}
            </h3>
            <div className="flex h-3 rounded-full overflow-hidden bg-muted">
              <div
                className="bg-primary transition-all duration-700"
                style={{ width: `${community.leftPct}%` }}
              />
              <div
                className="bg-muted-foreground/30 transition-all duration-700"
                style={{ width: `${community.rightPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm font-mono">
              <span className="text-primary font-bold">{community.leftPct}% — {duel.left.title}</span>
              <span className="text-muted-foreground">{duel.right.title} — {community.rightPct}%</span>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Duel;
