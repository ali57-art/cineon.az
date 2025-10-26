import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export type Language = "az" | "ru" | "en" | "it" | "tr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>("az");

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("preferred_language")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.preferred_language) {
            setLanguageState(data.preferred_language as Language);
          }
        });
    } else {
      const savedLang = localStorage.getItem("language") as Language;
      if (savedLang) {
        setLanguageState(savedLang);
      }
    }
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    
    if (user) {
      await supabase
        .from("profiles")
        .update({ preferred_language: lang })
        .eq("id", user.id);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
