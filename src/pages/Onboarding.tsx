import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useMovieGenres } from "@/hooks/useMovies";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGS = [
  { c: "az", l: "Azərbaycan" },
  { c: "en", l: "English" },
  { c: "tr", l: "Türkçe" },
  { c: "ru", l: "Русский" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const genres = useMovieGenres();
  const [step, setStep] = useState(1);
  const [langs, setLangs] = useState<string[]>(["az", "en"]);
  const [favGenres, setFavGenres] = useState<number[]>([]);
  const [dislikedGenres, setDisliked] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data?.onboarding_completed) navigate("/");
        if (data?.preferred_languages) setLangs(data.preferred_languages);
        if (data?.favorite_genres) setFavGenres(data.favorite_genres);
        if (data?.disliked_genres) setDisliked(data.disliked_genres);
      });
  }, [user, navigate]);

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("user_preferences").upsert({
      user_id: user.id,
      preferred_languages: langs,
      favorite_genres: favGenres,
      disliked_genres: dislikedGenres,
      onboarding_completed: true,
    } as any, { onConflict: "user_id" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Xoş gəldin!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <Sparkles className="w-10 h-10 text-primary mx-auto" />
          <h1 className="font-display text-4xl">Cineon-a xoş gəldin</h1>
          <p className="text-muted-foreground">Sənə xüsusi tövsiyələr üçün bir neçə sual</p>
          <div className="flex justify-center gap-1.5 pt-3">
            {[1, 2, 3].map(s => (
              <div key={s} className={cn("h-1.5 w-10 rounded-full", s <= step ? "bg-primary" : "bg-muted")} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Hansı dillərdə kontent izləmək istərdin?</h2>
            <div className="flex flex-wrap gap-2">
              {LANGS.map(l => (
                <Badge key={l.c} variant={langs.includes(l.c) ? "default" : "outline"}
                  className="cursor-pointer text-sm py-2 px-4"
                  onClick={() => toggle(langs, l.c, setLangs)}>
                  {langs.includes(l.c) && <Check className="w-3 h-3 mr-1" />}
                  {l.l}
                </Badge>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!langs.length}>Növbəti</Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Sevimli janrların?</h2>
            <div className="flex flex-wrap gap-2">
              {genres.data?.genres?.map((g: any) => (
                <Badge key={g.id} variant={favGenres.includes(g.id) ? "default" : "outline"}
                  className="cursor-pointer text-sm py-2 px-4"
                  onClick={() => toggle(favGenres, g.id, setFavGenres)}>
                  {favGenres.includes(g.id) && <Check className="w-3 h-3 mr-1" />}
                  {g.name}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Geri</Button>
              <Button onClick={() => setStep(3)} disabled={favGenres.length < 2}>Növbəti</Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Hansı janrları sevmirsən?</h2>
            <p className="text-sm text-muted-foreground">Bu janrlardakı tövsiyələri azaldacağıq</p>
            <div className="flex flex-wrap gap-2">
              {genres.data?.genres?.filter((g: any) => !favGenres.includes(g.id)).map((g: any) => (
                <Badge key={g.id} variant={dislikedGenres.includes(g.id) ? "destructive" : "outline"}
                  className="cursor-pointer text-sm py-2 px-4"
                  onClick={() => toggle(dislikedGenres, g.id, setDisliked)}>
                  {g.name}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Geri</Button>
              <Button onClick={finish} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Bitir
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Onboarding;
