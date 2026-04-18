import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import cineonReel from "@/assets/cineon-reel.png";

interface HeaderProps {
  onShowPlans?: () => void;
}

const Header = ({ onShowPlans }: HeaderProps) => {
  const { signOut } = useAuth();
  const { language } = useLanguage();
  const { isPro } = useSubscription();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl transition-shadow duration-300",
        scrolled && "shadow-[0_4px_30px_hsl(240_30%_2%/0.6)]"
      )}
    >
      <div className="container mx-auto px-4 h-[72px] flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group" aria-label="Cineon">
          <span className="text-3xl font-display tracking-wide text-foreground leading-none">
            Cine
          </span>
          <img
            src={cineonReel}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain transition-transform duration-700 group-hover:rotate-180"
          />
          <span className="text-3xl font-display tracking-wide text-foreground leading-none">
            n
          </span>
        </a>

        <div className="flex items-center gap-2 md:gap-3">
          {isPro && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30">
              <Crown className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Pro</span>
            </div>
          )}
          {onShowPlans && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowPlans}
              className="gap-2 border-primary/40 hover:bg-primary/10 hover:text-primary hover:border-primary"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isPro ? t("currentPlan", language) : t("upgradeToPro", language)}
              </span>
            </Button>
          )}
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t("logout", language)}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
