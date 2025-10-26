import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder", language)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 text-lg bg-card border-border focus:border-primary transition-colors"
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          disabled={isLoading || !query.trim()}
          className="h-14 px-8"
        >
          {t("search", language)}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
