import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { useSubscription } from "@/hooks/useSubscription";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  onShowPlans?: () => void;
}

const Header = ({ onShowPlans }: HeaderProps) => {
  const { signOut } = useAuth();
  const { language } = useLanguage();
  const { isPro } = useSubscription();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-[73px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assets/questoindex-logo.png" 
            alt="QuestoIndex" 
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            QuestoIndex
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {isPro && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Pro</span>
            </div>
          )}
          {onShowPlans && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onShowPlans}
              className="gap-2"
            >
              <Crown className="w-4 h-4" />
              {isPro ? t("currentPlan", language) : t("upgradeToPro", language)}
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
            {t("logout", language)}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;