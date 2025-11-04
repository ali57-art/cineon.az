import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/i18n/translations';

interface AIMovieSummaryProps {
  title: string;
  year: string;
  plot: string;
  genre: string;
}

const AIMovieSummary = ({ title, year, plot, genre }: AIMovieSummaryProps) => {
  const { language } = useLanguage();
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>('');

  const generateSummary = async () => {
    if (!isPro) {
      toast({
        title: 'Pro abunəlik tələb olunur',
        description: 'Bu funksiya yalnız Pro üzvlər üçündür',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-movie-summary', {
        body: { title, year, plot, genre, language }
      });

      if (error) throw error;

      setSummary(data.summary);
      toast({
        title: 'Uğurlu',
        description: 'AI xülasə yaradıldı',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Xəta',
        description: error instanceof Error ? error.message : 'Xülasə yaradıla bilmədi',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <Button
        onClick={generateSummary}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Yaradılır...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Xülasə (5 sətir)
          </>
        )}
      </Button>

      {summary && (
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="font-semibold text-sm">AI Xülasə</span>
          </div>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default AIMovieSummary;
