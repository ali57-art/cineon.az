import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { useSearch, type SearchType } from "@/hooks/useSearch";
import MediaGrid from "@/components/MediaGrid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [type, setType] = useState<SearchType>("multi");
  const { data, isLoading } = useSearch(query, type);

  const onChange = (v: string) => {
    setQuery(v);
    if (v) setParams({ q: v }, { replace: true });
    else setParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Film, serial, aktyor axtar..."
            className="h-14 pl-12 pr-12 rounded-full text-base glass-surface"
            autoFocus
          />
          {query && (
            <button
              onClick={() => onChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Təmizlə"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <Tabs value={type} onValueChange={(v) => setType(v as SearchType)} className="flex justify-center">
          <TabsList>
            <TabsTrigger value="multi">Hamısı</TabsTrigger>
            <TabsTrigger value="movie">Filmlər</TabsTrigger>
            <TabsTrigger value="tv">Seriallar</TabsTrigger>
            <TabsTrigger value="person">Şəxslər</TabsTrigger>
          </TabsList>
        </Tabs>

        {query.length < 2 ? (
          <p className="text-center text-muted-foreground py-12">Axtarış üçün ən azı 2 hərf yazın</p>
        ) : type === "person" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {data?.results?.filter((p: any) => p.profile_path).map((p: any) => (
              <a
                key={p.id}
                href={`/person/${p.id}`}
                className="text-center group"
              >
                <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-muted shadow-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w185${p.profile_path}`}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-sm font-semibold mt-2 line-clamp-1">{p.name}</p>
              </a>
            ))}
          </div>
        ) : (
          <MediaGrid
            items={data?.results}
            loading={isLoading}
            showType={type === "multi"}
            emptyText="Heç nə tapılmadı"
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
