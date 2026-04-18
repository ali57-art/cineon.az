import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Bot, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";

const AIRecommend = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6 py-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/30 shadow-glow">
            <Bot className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-foreground">
            {t("aiRecommend", language)}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("comingSoonDesc", language)}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground font-mono uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-primary" />
            {t("comingSoon", language)}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIRecommend;
