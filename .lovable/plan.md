## Məqsəd

1. Cineon loqosunun sonundakı qırmızı (yanıb-sönən) nöqtəni silmək.
2. Bütün film/serial məzmununu Azərbaycan dilində yükləmək; AZ yoxdursa TR, o da yoxdursa EN-ə düşmək.
3. Pleyerdə altyazıları (sub) aktivləşdirmək — eyni dil prioriteti ilə.

## Dəyişikliklər

### 1. Logo (qırmızı nöqtənin silinməsi)
`src/components/Header.tsx` — logo blokundakı bu sətri silirik:
```
<span className="absolute -bottom-0.5 -right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
```
Konteyner `relative` qalır (lazım deyilsə təmizlənir). Başqa heç bir vizual dəyişiklik yoxdur.

### 2. Dil fallback sistemi (TMDB)

TMDB-də tam `az-AZ` lokalizasiyası məhduddur — bir çox film/serial üçün başlıq və `overview` boş gəlir. Buna görə **proxy səviyyəsində** ağıllı fallback qururuq.

`supabase/functions/tmdb-proxy/index.ts`:
- Default dil `az-AZ` qalır.
- **Detail endpoints** (`/movie/{id}`, `/tv/{id}`) üçün `append_to_response` siyahısına `translations` əlavə edirik. Cavabda `overview`, `title`/`name`, `tagline` boşdursa, `translations.translations` massivindən sırayla `az-AZ` → `tr-TR` → `en-US` axtarıb dolduruq.
- **Liste endpoints** (`/movie/popular`, `/trending/...`, `/discover/*`, `/search/*`, season/episode və s.) üçün: nəticəni az-AZ ilə alırıq, sonra hər `result` üçün `overview` və ya `title`/`name` boşdursa, eyni endpointi paralel olaraq `tr-TR`, lazımsa `en-US` ilə də çəkib boş sahələri **per-id merge** edirik. Sadə LRU keş (Map, ~5 dəq TTL) əlavə edirik ki, hər istək üçün təkrar TMDB çağırışı olmasın.
- `include_image_language=az,tr,en,null` parametrini avtomatik əlavə edirik ki, posterlər/backdrop-lar boş qalmasın.

Frontend (`src/services/tmdb.ts`) — heç bir API dəyişikliyi lazım deyil, çünki bütün məntiq proxy-də.

### 3. Pleyer altyazıları
`src/services/videoProvider.ts` — VidSrc embed-ə `ds_lang` parametri əlavə edirik (default subtitle dili). `sub_url` üçün yer saxlayırıq amma istifadə etmirik:
```
${PRIMARY}/movie/${tmdbId}?ds_lang=az
${PRIMARY}/tv/${tmdbId}/${s}/${e}?ds_lang=az
```
VidSrc `ds_lang` üçün avtomatik fallback verir (mövcud deyilsə pleyer öz dil siyahısını göstərir). Fallback URL üçün də eyni parametri qoyuruq.

`src/pages/WatchPage.tsx` — pleyerin yanına kiçik "Altyazı dili" seçici (AZ / TR / EN) əlavə edirik; seçim `ds_lang` parametrini dəyişib iframe-i yeniləyir. Default `az`.

### 4. Dil tanıtım yardımçısı
`src/lib/lang.ts` (yeni, ~20 sətir) — `pickTranslation(translations, ['az-AZ','tr-TR','en-US'])` köməkçi funksiyası. Həm proxy-də (Deno-da inline kopyası), həm də UI-də gərək olarsa istifadə üçün.

## Texniki qeydlər

- TMDB `translations` strukturu: `{ translations: [{ iso_639_1, iso_3166_1, data: { title|name, overview, tagline } }] }`. Açar formatı: `${iso_639_1}-${iso_3166_1}` (məs. `az-AZ`, `tr-TR`, `en-US`).
- Liste endpointlərində paralel ikinci/üçüncü çağırışlar yalnız boş overview olan ən azı 1 element olarsa edilir (performans qoruması).
- Keş açarı: `endpoint + JSON(params)`. TTL 5 dəqiqə.
- Heç bir DB miqrasiyası yoxdur. Yalnız edge function + 3 frontend fayl.

## Toxunulan fayllar

- `src/components/Header.tsx` (qırmızı nöqtə silinir)
- `supabase/functions/tmdb-proxy/index.ts` (fallback + translations merge + keş)
- `src/services/videoProvider.ts` (`ds_lang` əlavə)
- `src/pages/WatchPage.tsx` (altyazı dili seçici)
- `src/lib/lang.ts` (yeni köməkçi — ixtiyari)
