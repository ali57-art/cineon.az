import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";

interface EmptyStateProps {
  query?: string;
}

const EmptyState = ({ query }: EmptyStateProps) => {
  const { language } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-primary" />
      </div>
      {query ? (
        <>
          <h3 className="text-2xl font-semibold mb-2 text-foreground">{t("noResults", language)}</h3>
          <p className="text-muted-foreground max-w-md">
            {t("tryDifferentSearch", language)}
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-semibold mb-2 text-foreground">{t("search", language)}</h3>
          <p className="text-muted-foreground max-w-md">
            {t("searchPlaceholder", language)}
          </p>
        </>
      )}
    </div>
  );
};

export default EmptyState;
