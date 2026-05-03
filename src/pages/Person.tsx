import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { usePersonDetails } from "@/hooks/useMovies";
import MediaGrid from "@/components/MediaGrid";
import { tmdb } from "@/services/tmdb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Person = () => {
  const { id } = useParams();
  const { data, isLoading } = usePersonDetails(Number(id));

  const credits = [
    ...((data?.movie_credits?.cast ?? []).map((c: any) => ({ ...c, media_type: "movie" }))),
    ...((data?.tv_credits?.cast ?? []).map((c: any) => ({ ...c, media_type: "tv" }))),
  ].sort((a: any, b: any) => (b.vote_count ?? 0) - (a.vote_count ?? 0));

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        {isLoading ? (
          <p className="text-muted-foreground">Yüklənir…</p>
        ) : data ? (
          <>
            <div className="flex items-start gap-6 flex-wrap">
              <Avatar className="w-32 h-32">
                <AvatarImage src={tmdb.image.profile(data.profile_path, "h632")} />
                <AvatarFallback>{data.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-3xl md:text-4xl">{data.name}</h1>
                {data.known_for_department && <p className="text-muted-foreground">{data.known_for_department}</p>}
                {data.birthday && <p className="text-sm text-muted-foreground mt-1">Doğum: {data.birthday}{data.place_of_birth ? ` • ${data.place_of_birth}` : ""}</p>}
                {data.biography && <p className="text-sm mt-3 line-clamp-6">{data.biography}</p>}
              </div>
            </div>

            <h2 className="font-display text-2xl mt-6">Filmoqrafiya</h2>
            <MediaGrid items={credits.slice(0, 30)} showType />
          </>
        ) : (
          <p>Tapılmadı</p>
        )}
      </main>
    </div>
  );
};

export default Person;
