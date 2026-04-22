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
      <div className="relative flex items-center gap-2 group">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder", language)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 text-lg rounded-2xl glass-surface border border-border/60 shadow-card focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] transition-all duration-200 focus-visible:scale-[1.005]"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !query.trim()}
          className="h-14 px-8 rounded-2xl transition-all duration-200 hover:scale-[1.03] hover:shadow-elegant active:scale-[0.98]"
        >
          {t("search", language)}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
