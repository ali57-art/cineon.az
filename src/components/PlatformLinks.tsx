import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";

interface PlatformLinksProps {
  title: string;
  imdbID?: string;
}

const PlatformLinks = ({ title, imdbID }: PlatformLinksProps) => {
  const { language } = useLanguage();

  const platforms = [
    {
      name: "Netflix",
      url: `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      name: "YouTube",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+trailer`,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      name: "Prime Video",
      url: `https://www.primevideo.com/search?phrase=${encodeURIComponent(title)}`,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "IMDb",
      url: imdbID ? `https://www.imdb.com/title/${imdbID}` : `https://www.imdb.com/find?q=${encodeURIComponent(title)}`,
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
        <ExternalLink className="w-4 h-4" />
        {t("watchOn", language)}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform.name}
            variant="secondary"
            size="sm"
            className={`${platform.color} text-white transition-all hover:scale-105`}
            onClick={() => window.open(platform.url, "_blank")}
          >
            {platform.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PlatformLinks;