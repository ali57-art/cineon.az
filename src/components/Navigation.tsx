import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { Home, Film, Tv, Baby, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const { language } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/", label: t("home", language), icon: Home },
    { path: "/movies", label: t("movies", language), icon: Film },
    { path: "/series", label: t("series", language), icon: Tv },
    { path: "/cartoons", label: t("cartoons", language), icon: Baby },
    { path: "/random", label: t("randomMovie", language), icon: Sparkles },
  ];

  return (
    <nav className="border-b bg-card/30 backdrop-blur-md sticky top-[73px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "hover:bg-accent hover:scale-105 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
