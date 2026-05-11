// TMDB API proxy — bütün TMDB endpointlərini server tərəfindən çağırır.
// AZ -> TR -> EN dil fallback məntiqi ilə.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TMDB_BASE = "https://api.themoviedb.org/3";
const LANG_PRIORITY = ["az-AZ", "tr-TR", "en-US"];

// Sadə in-memory keş (5 dəqiqə TTL)
const cache = new Map<string, { at: number; data: any }>();
const TTL_MS = 5 * 60 * 1000;

function cacheGet(key: string) {
  const v = cache.get(key);
  if (!v) return null;
  if (Date.now() - v.at > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return v.data;
}
function cacheSet(key: string, data: any) {
  if (cache.size > 500) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { at: Date.now(), data });
}

async function tmdbFetch(
  apiKey: string,
  endpoint: string,
  params: Record<string, string | number>,
  language: string,
) {
  const cacheKey = `${endpoint}|${language}|${JSON.stringify(params)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, data: cached };

  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", language);
  if (!params.include_image_language) {
    url.searchParams.set("include_image_language", "az,tr,en,null");
  }
  for (const [k, v] of Object.entries(params)) {
    if (k === "language") continue;
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const resp = await fetch(url.toString());
  const data = await resp.json();
  if (resp.ok) cacheSet(cacheKey, data);
  return { status: resp.status, data };
}

function pickFromTranslations(translations: any[], field: "title" | "name" | "overview" | "tagline") {
  if (!Array.isArray(translations)) return null;
  for (const lang of LANG_PRIORITY) {
    const [iso6391, iso31661] = lang.split("-");
    const t = translations.find(
      (x: any) => x.iso_639_1 === iso6391 && x.iso_3166_1 === iso31661,
    );
    const val = t?.data?.[field];
    if (val && String(val).trim()) return val;
  }
  // son ehtiyat: hər hansı en
  const en = translations.find((x: any) => x.iso_639_1 === "en");
  return en?.data?.[field] || null;
}

function fillDetail(data: any) {
  const tr = data?.translations?.translations;
  if (!tr) return data;
  if (!data.overview || !data.overview.trim()) {
    data.overview = pickFromTranslations(tr, "overview") || data.overview || "";
  }
  if ("title" in data && (!data.title || !data.title.trim())) {
    data.title = pickFromTranslations(tr, "title") || data.title;
  }
  if ("name" in data && (!data.name || !data.name.trim())) {
    data.name = pickFromTranslations(tr, "name") || data.name;
  }
  if ("tagline" in data && (!data.tagline || !data.tagline.trim())) {
    data.tagline = pickFromTranslations(tr, "tagline") || data.tagline || "";
  }
  return data;
}

function isDetailEndpoint(endpoint: string) {
  return /^\/(movie|tv)\/\d+$/.test(endpoint);
}

function hasResultsList(data: any) {
  return data && Array.isArray(data.results);
}

function needsFill(item: any) {
  const titleEmpty = !(item.title || item.name) || !String(item.title || item.name).trim();
  const overviewEmpty = !item.overview || !String(item.overview).trim();
  return titleEmpty || overviewEmpty;
}

function mergeListResults(primary: any, fallback: any) {
  if (!hasResultsList(primary) || !hasResultsList(fallback)) return primary;
  const map = new Map<number, any>();
  for (const it of fallback.results) map.set(it.id, it);
  for (const it of primary.results) {
    if (!needsFill(it)) continue;
    const fb = map.get(it.id);
    if (!fb) continue;
    if ((!it.overview || !it.overview.trim()) && fb.overview) it.overview = fb.overview;
    if ((!it.title || !it.title.trim()) && fb.title) it.title = fb.title;
    if ((!it.name || !it.name.trim()) && fb.name) it.name = fb.name;
  }
  return primary;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY");
    if (!TMDB_API_KEY) {
      return new Response(JSON.stringify({ error: "TMDB_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { endpoint, params = {} } = body as {
      endpoint?: string;
      params?: Record<string, string | number>;
    };

    if (!endpoint || typeof endpoint !== "string" || !endpoint.startsWith("/")) {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (endpoint.includes("..") || endpoint.includes("//")) {
      return new Response(JSON.stringify({ error: "Invalid path" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const requestedLang = (params.language as string) || "az-AZ";
    const userParams = { ...params };
    delete userParams.language;

    // Detail endpoint: append translations və boş sahələri doldur
    if (isDetailEndpoint(endpoint)) {
      const append = String(userParams.append_to_response || "");
      const appendSet = new Set(append.split(",").map((s) => s.trim()).filter(Boolean));
      appendSet.add("translations");
      userParams.append_to_response = Array.from(appendSet).join(",");

      const { status, data } = await tmdbFetch(TMDB_API_KEY, endpoint, userParams, requestedLang);
      if (status >= 400) {
        return new Response(JSON.stringify(data), {
          status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(fillDetail(data)), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Standard çağırış
    const primary = await tmdbFetch(TMDB_API_KEY, endpoint, userParams, requestedLang);
    if (primary.status >= 400) {
      return new Response(JSON.stringify(primary.data), {
        status: primary.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let merged = primary.data;

    // Liste endpointləri üçün boş sahələri TR/EN ilə doldur
    if (hasResultsList(merged)) {
      const needsAny = merged.results.some(needsFill);
      if (needsAny) {
        const fallbackLangs = LANG_PRIORITY.filter((l) => l !== requestedLang);
        for (const lang of fallbackLangs) {
          const fb = await tmdbFetch(TMDB_API_KEY, endpoint, userParams, lang);
          if (fb.status < 400) merged = mergeListResults(merged, fb.data);
          if (!merged.results.some(needsFill)) break;
        }
      }
    } else if (
      // Tek obyekt cavablar üçün də (məs season): overview-ları doldur
      Array.isArray(merged?.episodes)
    ) {
      const needsAny = merged.episodes.some((e: any) => !e.overview || !e.overview.trim() || !e.name);
      if (needsAny) {
        const fallbackLangs = LANG_PRIORITY.filter((l) => l !== requestedLang);
        for (const lang of fallbackLangs) {
          const fb = await tmdbFetch(TMDB_API_KEY, endpoint, userParams, lang);
          if (fb.status < 400 && Array.isArray(fb.data?.episodes)) {
            const map = new Map<number, any>();
            for (const e of fb.data.episodes) map.set(e.episode_number, e);
            for (const e of merged.episodes) {
              const f = map.get(e.episode_number);
              if (!f) continue;
              if ((!e.overview || !e.overview.trim()) && f.overview) e.overview = f.overview;
              if ((!e.name || !e.name.trim()) && f.name) e.name = f.name;
            }
          }
          if (!merged.episodes.some((e: any) => !e.overview || !e.overview.trim())) break;
        }
      }
    }

    return new Response(JSON.stringify(merged), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("tmdb-proxy error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
