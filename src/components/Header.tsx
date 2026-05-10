import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LogOut, Crown, Search, User, Sparkles, Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import cineonReel from "@/assets/cineon-reel.png";

interface HeaderProps {
  onShowPlans?: () => void;
}

const navItems = [
  { to: "/", label: "Ana" },
  { to: "/movies", label: "Filmlər" },
  { to: "/series", label: "Seriallar" },
  { to: "/cartoons", label: "Cizgi" },
  { to: "/ai-recommend", label: "AI" },
  { to: "/duel", label: "Duel" },
];

const Header = ({ onShowPlans }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const { isPro } = useSubscription();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        scrolled && "shadow-card",
      )}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 h-[60px] md:h-[72px] flex items-center justify-between gap-2 md:gap-4">
        {/* Mobile hamburger */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menyu">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetTitle className="sr-only">Naviqasiya</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border/40">
                <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                  <span className="text-2xl font-display">Cine</span>
                  <img src={cineonReel} alt="" className="h-7 w-7 object-contain" />
                  <span className="text-2xl font-display text-primary">n</span>
                </Link>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="pt-3 mt-3 border-t border-border/40 space-y-1">
                  {user && (
                    <>
                      <NavLink to="/watchlist" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted">Siyahım</NavLink>
                      <NavLink to="/history" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted">Tarixçə</NavLink>
                      <NavLink to="/lists" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted">Kolleksiyalar</NavLink>
                      <NavLink to="/feed" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted">Lent</NavLink>
                      <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted">Profil</NavLink>
                    </>
                  )}
                </div>
              </nav>
              {user ? (
                <div className="p-4 border-t border-border/40">
                  <Button variant="outline" className="w-full gap-2" onClick={() => { signOut(); setMenuOpen(false); }}>
                    <LogOut className="w-4 h-4" /> {t("logout", language)}
                  </Button>
                </div>
              ) : (
                <div className="p-4 border-t border-border/40">
                  <Button asChild className="w-full gap-2">
                    <Link to="/auth" onClick={() => setMenuOpen(false)}>
                      <Sparkles className="w-4 h-4" /> Daxil ol
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-1 sm:gap-2 group relative flex-shrink-0" aria-label="Cineon">
          <span className="text-2xl md:text-3xl font-display tracking-wide text-foreground leading-none">Cine</span>
          <img
            src={cineonReel}
            alt=""
            width={32}
            height={32}
            className="h-7 w-7 md:h-8 md:w-8 object-contain transition-transform duration-700 group-hover:rotate-180"
          />
          <span className="text-2xl md:text-3xl font-display tracking-wide text-primary leading-none">n</span>
          <span className="absolute -bottom-0.5 -right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Axtarış">
            <Link to="/search"><Search className="w-5 h-5" /></Link>
          </Button>

          {user && <NotificationBell />}

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
              className="hidden md:inline-flex gap-2 border-primary/40 hover:bg-primary/10 hover:text-primary hover:border-primary"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">{isPro ? t("currentPlan", language) : t("upgradeToPro", language)}</span>
            </Button>
          )}
          <div className="hidden sm:flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          {user ? (
            <>
              <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Profil">
                <Link to="/profile"><User className="w-5 h-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex" onClick={signOut} aria-label={t("logout", language)}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="gap-1.5 hidden sm:inline-flex">
              <Link to="/auth"><Sparkles className="w-4 h-4" /> Daxil ol</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
