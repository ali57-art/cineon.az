import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

const SubscriptionPlans = () => {
  const { language } = useLanguage();
  const { isPro } = useSubscription();
  const { toast } = useToast();

  const handleUpgrade = () => {
    toast({
      title: t("comingSoon", language),
      description: "Premium abunəlik tezliklə əlçatan olacaq",
    });
  };

  const features = {
    free: [
      { az: "Əsas axtarış", en: "Basic search", ru: "Базовый поиск", it: "Ricerca di base", tr: "Temel arama" },
      { az: "10 film/gün", en: "10 movies/day", ru: "10 фильмов/день", it: "10 film/giorno", tr: "10 film/gün" },
      { az: "Reklamlar", en: "Ads included", ru: "С рекламой", it: "Con pubblicità", tr: "Reklamlar dahil" },
    ],
    pro: [
      { az: "AI tövsiyələri", en: "AI recommendations", ru: "ИИ рекомендации", it: "Raccomandazioni AI", tr: "AI önerileri" },
      { az: "Limitsiz axtarış", en: "Unlimited search", ru: "Неограниченный поиск", it: "Ricerca illimitata", tr: "Sınırsız arama" },
      { az: "Reklamsız", en: "Ad-free", ru: "Без рекламы", it: "Senza pubblicità", tr: "Reklamsız" },
      { az: "Qabaqcıl filtrlər", en: "Advanced filters", ru: "Расширенные фильтры", it: "Filtri avanzati", tr: "Gelişmiş filtreler" },
      { az: "İzləmə siyahısı", en: "Watchlist", ru: "Список просмотра", it: "Lista da guardare", tr: "İzleme listesi" },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto p-6">
      <Card className="p-6 border-2 hover:border-primary/50 transition-all">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{t("free", language)}</h3>
          <p className="text-3xl font-bold">$0<span className="text-lg text-muted-foreground">/ay</span></p>
          <ul className="space-y-3">
            {features.free.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span>{feature[language as keyof typeof feature]}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" disabled={!isPro}>
            {!isPro ? t("currentPlan", language) : t("downgrade", language)}
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-2 border-primary relative overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all">
        <div className="absolute top-4 right-4">
          <Crown className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            Pro
          </h3>
          <p className="text-3xl font-bold">$9.99<span className="text-lg text-muted-foreground">/ay</span></p>
          <ul className="space-y-3">
            {features.pro.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <span>{feature[language as keyof typeof feature]}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full" onClick={handleUpgrade} disabled={isPro}>
            {isPro ? t("currentPlan", language) : t("upgradeToPro", language)}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;