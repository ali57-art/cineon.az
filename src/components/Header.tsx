import logo from "@/assets/questoindex-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="QuestoIndex Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">QuestoIndex</h1>
              <p className="text-sm text-muted-foreground">Discover Movies with OMDb Power</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  {user.email}
                </Button>
                <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  {t("signOut", language)}
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate("/auth")}>
                {t("signIn", language)}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
