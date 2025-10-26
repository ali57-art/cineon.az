import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Languages } from "lucide-react";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "az", name: "Azərbaycan", flag: "🇦🇿" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="w-4 h-4" />
          <span>{currentLang?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
