
# Cineon v2 — Tam Platforma Planı

## Vacib şərtlər

1. **TMDB API açarı** — siz `themoviedb.org`-dan pulsuz açar alacaqsınız, mən `add_secret` ilə `TMDB_API_KEY` adı ilə Supabase secret kimi əlavə edəcəyəm. Açarı brauzerə YAZMAYACAĞAM — bütün TMDB çağırışları `tmdb-proxy` edge function üzərindən gedəcək.
2. **Video provider** — sizin öz legal provider-iniz olduğu üçün, WatchPage-də konfiqurasiya edilə bilən embed URL pattern saxlayacağam (default: placeholder mesaj "Video provider URL-i `src/services/videoProvider.ts`-də konfiqurasiya edin"). Pirat sayt embed etməyəcəyəm.
3. **AI** — OpenAI əvəzinə artıq qurulmuş **Lovable AI** (`google/gemini-3-flash-preview`) istifadə olunacaq. Açar lazım deyil.
4. **Mövcud DB** uzadılır, yox edilmir. `user_watchlist` cədvəli saxlanır, `media_id`/`media_type` sütunları əlavə olunur (TMDB ID üçün).

## Realist gözlənti

Bir mesajda 30+ səhifə + 13 komponent + AI + sosial sistem mümkündür, amma:
- **Detallı**: HomePage, MovieDetail, TVDetail, SearchPage, WatchlistPage, ProfilePage, AuthPages, OnboardingPage, SettingsPage, AIRecommendations
- **Funksional minimal**: PersonPage, GenrePage, TrendingPage, TopRatedPage, ListsPage, NotificationsPage, ActivityFeed, PublicProfile, HistoryPage (işləyir, amma sadə UI)
- **Skeleton/növbəti iterasiya**: Advanced video player kontrolları (PiP, intro skip detection, swipe gestures), PWA service worker, virtualized infinite scroll, drag-drop list reordering, comprehensive a11y audit, react-helmet SEO hər səhifə üçün

## Faza 1 — Database genişləndirilməsi (migration)

Mövcud cədvəllərin üzərinə əlavə:

```text
ALTER user_watchlist  → media_id (int), media_type ('movie'|'tv') əlavə (imdb_id saxlanır geriyə uyğunluq üçün)
ALTER profiles        → username (unique), bio, subscription_plan default 'free'

YENİ:
- watch_history       (user_id, media_id, media_type, season, episode, progress_seconds, duration_seconds, completed)
- ratings             (user_id, media_id, media_type, rating 0-10, review, spoiler_flag)
- user_preferences    (user_id PK, favorite_genres int[], disliked_genres int[], onboarding_completed)
- lists               (id, user_id, name, description, is_public, cover_image)
- list_items          (list_id, media_id, media_type, notes)
- list_likes          (list_id, user_id)
- follows             (follower_id, following_id)
- activity            (user_id, type, payload jsonb, created_at)  — feed üçün
- notifications       (user_id, type, title, body, data jsonb, read)
```

Hər cədvələ RLS + policy. `profiles` `is_public` üçün ayrıca SELECT policy. `auth.users` referansları cascade.

## Faza 2 — Edge functions

| Function | Məqsəd |
|----------|--------|
| `tmdb-proxy` | Bütün TMDB endpoint-ləri (popular, trending, top_rated, upcoming, details, search/multi, search/person, discover, person, season, episode, genres). Query parametrlərini ötürür, `language=az-AZ` default. |
| `ai-recommendations` (mövcud, yenilənir) | Lovable AI Gateway, watch_history + ratings + preferences-ə əsasən structured output (tool calling) ilə 10 tövsiyə. |
| `omdb-proxy` (mövcud) | Saxlanır legacy üçün, sonra silinə bilər. |

## Faza 3 — Servis və hook qatı

```text
src/services/tmdb.ts          → bütün TMDB metodları, supabase.functions.invoke('tmdb-proxy') üzərindən
src/services/videoProvider.ts → konfiqurasiya edilə bilən embed URL builder
src/hooks/useMovies.ts        → React Query wrapper-lər (popular, trending, details, ...)
src/hooks/useWatchlist.ts     → CRUD + optimistic updates
src/hooks/useWatchHistory.ts  → progress auto-save (5 saniyəlik throttle)
src/hooks/useRatings.ts
src/hooks/useSearch.ts        → 300ms debounce
src/hooks/useInfiniteScroll.ts
src/hooks/useNotifications.ts → Supabase Realtime
src/hooks/useFollow.ts
src/hooks/useLists.ts
src/hooks/useProfile.ts
```

## Faza 4 — Routing (App.tsx)

Bütün route-lar mövcud strukturun üzərinə əlavə olunur. `BottomNav` saxlanır.

```text
PUBLIC:
/, /movies, /series, /movie/:id, /tv/:id, /tv/:id/season/:season,
/person/:id, /search, /genre/:type/:id, /trending, /top-rated,
/new-releases, /auth (mövcud), /onboarding

PROTECTED (yeni ProtectedRoute komponenti):
/watch/movie/:id, /watch/tv/:id/:season/:episode,
/profile, /profile/:username, /watchlist, /history,
/lists, /lists/:id, /recommendations, /settings, /notifications
```

## Faza 5 — Səhifələr

**Detallı (tam funksional, polished):**
- `Index.tsx` (HomePage) — Hero auto-rotate, 10 kategoriya carousel, AI tövsiyə bölməsi
- `MovieDetailPage` — Hero + 6 tab (Cast, Videos, Images, Similar, Reviews, Info)
- `TVDetailPage` — Hero + sezon selector + EpisodeList + tablar
- `SearchPage` — debounced search, sol panel filter (tip, janr, il, reytinq, dil, sort)
- `MoviesPage` / `SeriesPage` — Hero + genre bubble filtr + sonsuz scroll grid
- `WatchlistPage` — grid/list toggle, filter, drag-drop yox (sadə sıralama)
- `ProfilePage` — avatar upload, statistika kartları, 6 tab
- `OnboardingPage` — 5 addımlı (welcome, genres, movies, actors, ready)
- `SettingsPage` — 5 tab (Account, Preferences, Notifications, Privacy, Subscription)
- `RecommendationsPage` — AI + janr-əsaslı + dost-əsaslı bölmələr

**Funksional minimal:**
- `PersonPage`, `SeasonPage`, `WatchMoviePage`, `WatchEpisodePage`, `GenrePage`, `TrendingPage`, `TopRatedPage`, `NewReleasesPage`, `HistoryPage`, `ListsPage`, `ListDetailPage`, `PublicProfilePage`, `NotificationsPage`

## Faza 6 — Komponentlər

```text
components/
├── MediaCard.tsx          (poster, hover overlay, watchlist toggle, progress bar)
├── MediaGrid.tsx          (responsive grid + skeleton + empty state)
├── CategoryRow.tsx        (üfüqi scroll, drag, ox düymələri, lazy)
├── HeroBanner.tsx         (auto-rotate, backdrop, action düymələr)
├── RatingStars.tsx        (yarım ulduz dəqiqliyi)
├── TrailerModal.tsx       (YouTube embed)
├── WatchlistButton.tsx    (optimistic toggle)
├── GenreBadge.tsx
├── PersonCard.tsx
├── EpisodeCard.tsx        (thumbnail, progress, izləndi check)
├── EpisodeList.tsx
├── SearchBar.tsx          (autocomplete, history)
├── LoadingSkeleton.tsx
├── ErrorBoundary.tsx
├── Navbar.tsx             (mövcud Header.tsx genişləndirilir)
├── Footer.tsx             (mövcud, polish)
├── VideoPlayer.tsx        (react-player wrapper, custom controls — basic version)
├── ActivityFeed.tsx
├── FollowButton.tsx
├── ListCard.tsx
├── NotificationBell.tsx   (realtime badge)
└── ProtectedRoute.tsx
```

## Faza 7 — Sosial sistem

- **Lists**: yarat/düzənlə/sil, public/private, item əlavə, `lists/:id` paylaşıla bilən
- **Follow**: `/profile/:username`-də follow düyməsi, follower count
- **Activity feed**: `/profile/:username` və `/` (logged-in) — user-in izlədiyi/qiymətləndirdiyi/list yaratdığı yazılır `activity` cədvəlinə (trigger ilə), feed göstərir
- **Notifications**: Supabase Realtime channel (`postgres_changes` on `notifications`), bell badge, `/notifications` səhifə

## Faza 8 — AI tövsiyə

`ai-recommendations` edge function:
- watch_history (top 20) + ratings (top 10) + preferences-i oxuyur
- TMDB-dən top-rated film detallarını çəkir
- Lovable AI-ya tool-calling ilə structured output: `[{title, year, reason}]`
- Hər tövsiyə üçün TMDB search edib full obyekt qaytarır
- Frontend: `RecommendationsPage` + HomePage-də "Sizin üçün" sırası

## Faza 9 — Auth genişləndirilməsi

Mövcud `Auth.tsx` saxlanır, üzərinə:
- `username` field (real-time mövcudluq yoxlaması, 500ms debounce)
- Qeydiyyatdan sonra `/onboarding`-ə redirect (əgər `user_preferences.onboarding_completed = false`)
- `ProtectedRoute` komponenti redirect parametri ilə

## Faza 10 — Dizayn sistemi

Mövcud cinematic light/dark sistem saxlanır. Spec-dəki cineon palette (gold #f5c842, red #e63946) artıq oxşardır. Yalnız:
- `--gold: 38 92% 50%` (artıq var)
- Skeleton shimmer (artıq var)
- Scrollbar (artıq var)

Heç nə dağıtmırıq, hazırkı premium light/dark toggle saxlanır.

## Çıxarılan / sonra

- **Advanced video player**: PiP, swipe gesture, intro/recap skip detection, multi-quality manifest parsing → basic react-player ilə qoşulur, sonra
- **PWA + Service Worker** → sonra
- **react-helmet SEO** hər səhifə üçün → əsas səhifələr üçün indi, qalanı sonra
- **Stripe payment** → placeholder düymə, real inteqrasiya sonra (`enable_stripe_payments`)
- **OAuth providers** Facebook/GitHub → yalnız Google indi (Lovable Cloud native)
- **Drag-drop list reordering** → sadə yuxarı/aşağı düymə
- **Virtualized lists** → react-query infinite scroll yetərlidir kiçik dataset üçün
- **Çoxdilli i18n** TMDB cavabları → AZ default, mövcud `LanguageContext` saxlanır UI üçün

## Sıra

1. DB migration (təsdiq sizdən)
2. `add_secret` TMDB_API_KEY (sizdən gözlənir)
3. `tmdb-proxy` edge function
4. Servislər + hooks
5. Komponentlər (alt → üst)
6. Səhifələr (detallı → minimal)
7. Routing
8. Sosial trigger-lər (activity auto-write)
9. AI tövsiyə yenilənməsi
10. Test və polish

## Risklər

- **Tək mesajda nəhəng həcm**: bəzi səhifələr minimal qalacaq, sonrakı iterasiyada doldurulacaq
- **TMDB rate limit**: 50 req/sec — edge function-da problem olmamalıdır, amma ehtiyatlı caching React Query ilə (5 dəq staleTime)
- **Mövcud `MovieCard`, `Index.tsx`, `Movies.tsx` və s.** TMDB strukturuna uyğunlaşdırılır — köhnə OMDb interfeysi qırılacaq, hər şey yenidən bağlanır
- **`src/types/movie.ts`** tam yenidən yazılır TMDB sxeminə uyğun

Təsdiq versəniz başlayıram. İlk addım DB migration olacaq, sonra TMDB açarınızı istəyəcəyəm.
