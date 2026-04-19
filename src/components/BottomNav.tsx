import { Link, useLocation } from "react-router-dom";
import { Home, Search, Bot, Swords, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { path: "/", label: "Home", icon: Home },
  { path: "/movies", label: "Search", icon: Search },
  { path: "/ai-recommend", label: "AI", icon: Bot },
  { path: "/duel", label: "Duel", icon: Swords },
  { path: "/random", label: "Random", icon: User },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 h-[60px] bg-background/95 backdrop-blur-xl border-t border-border/60"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
