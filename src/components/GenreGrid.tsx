import { useNavigate } from "react-router-dom";
import {
  Flame,
  Heart,
  Laugh,
  Ghost,
  Rocket,
  Drama,
  Brain,
  Baby,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";

interface GenreItem {
  key: string;
  label: string;
  query: string;
  icon: LucideIcon;
  gradient: string;
}

const GenreGrid = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const genres: GenreItem[] = [
    { key: "action", label: "Action", query: "action", icon: Flame, gradient: "from-red-500/20 to-orange-500/10" },
    { key: "comedy", label: "Comedy", query: "comedy", icon: Laugh, gradient: "from-yellow-500/20 to-amber-500/10" },
    { key: "drama", label: "Drama", query: "drama", icon: Drama, gradient: "from-purple-500/20 to-pink-500/10" },
    { key: "horror", label: "Horror", query: "horror", icon: Ghost, gradient: "from-slate-500/20 to-zinc-500/10" },
    { key: "scifi", label: "Sci-Fi", query: "sci-fi", icon: Rocket, gradient: "from-cyan-500/20 to-blue-500/10" },
    { key: "romance", label: "Romance", query: "romance", icon: Heart, gradient: "from-pink-500/20 to-rose-500/10" },
    { key: "thriller", label: "Thriller", query: "thriller", icon: Brain, gradient: "from-indigo-500/20 to-violet-500/10" },
    { key: "family", label: "Family", query: "family", icon: Baby, gradient: "from-green-500/20 to-emerald-500/10" },
    { key: "war", label: "War", query: "war", icon: Swords, gradient: "from-stone-500/20 to-neutral-500/10" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground">
            {t("discoverByGenre", language)}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono uppercase tracking-widest">
            {t("pickAMood", language)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        {genres.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.key}
              onClick={() => navigate(`/movies?search=${encodeURIComponent(g.query)}`)}
              className={`group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${g.gradient} bg-card hover:border-primary/60 transition-all hover:scale-[1.03] p-5 md:p-6 text-left`}
            >
              <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary mb-3 transition-transform group-hover:scale-110" />
              <div className="font-display text-lg md:text-xl tracking-wide text-foreground">
                {g.label}
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-24 h-24 text-primary" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default GenreGrid;
