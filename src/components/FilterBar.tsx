import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  contentType?: string;
}

export interface FilterState {
  year?: string;
  genre?: string;
}

const FilterBar = ({ onFilterChange, contentType }: FilterBarProps) => {
  const { language } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(false);

  const years = Array.from({ length: 30 }, (_, i) => (2024 - i).toString());
  
  const genres = {
    az: ["Dram", "Komediya", "Fantastika", "Qorxu", "Romantik", "Triller", "Macəra"],
    en: ["Drama", "Comedy", "Sci-Fi", "Horror", "Romance", "Thriller", "Adventure"],
    ru: ["Драма", "Комедия", "Фантастика", "Ужасы", "Романтика", "Триллер", "Приключения"],
    it: ["Drammatico", "Commedia", "Fantascienza", "Horror", "Romantico", "Thriller", "Avventura"],
    tr: ["Dram", "Komedi", "Bilim Kurgu", "Korku", "Romantik", "Gerilim", "Macera"],
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="gap-2"
      >
        <Filter className="w-4 h-4" />
        {t("filters", language)}
      </Button>

      {showFilters && (
        <div className="grid md:grid-cols-3 gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border animate-fade-in">
          <Select onValueChange={(value) => handleFilterChange("year", value)} value={filters.year}>
            <SelectTrigger>
              <SelectValue placeholder={t("year", language)} />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("genre", value)} value={filters.genre}>
            <SelectTrigger>
              <SelectValue placeholder={t("genre", language)} />
            </SelectTrigger>
            <SelectContent>
              {genres[language as keyof typeof genres]?.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            {t("clearFilters", language)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;