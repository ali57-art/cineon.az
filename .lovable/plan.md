## Cineon v2 — Qalan İş Planı

Əvvəlki mərhələdə DB miqrasiya, TMDB proxy, servislər, hook-lar və əsas komponentlər (MediaCard, HeroBanner, NotificationBell və s.) hazırlandı. İndi qalan hissəni tamamlayacağam.

### 1. Routing yenilənməsi (`src/App.tsx`)
Yeni route-lar əlavə olunacaq:
- `/movie/:id` → `MovieDetailPage`
- `/tv/:id` → `TVDetailPage`
- `/search` → `SearchPage`
- `/onboarding` → `OnboardingPage` (qorunan)
- `/profile/:username?` → `ProfilePage`
- `/watchlist`, `/history`, `/lists`, `/lists/:id`, `/notifications`, `/feed` → qorunan
- `/person/:id` → `PersonPage`
- `/genre/:type/:id` → `GenrePage`

`ProtectedRoute` artıq mövcuddur — auth tələb olunan route-ları onun altına yığacağam.

### 2. Köhnə OMDb səhifələrinin TMDB-yə miqrasiyası
Hazırda `Movies.tsx`, `Series.tsx`, `Cartoons.tsx` köhnə `searchMovies` (OMDb) çağırır və `Movie` (imdbID) tipindən istifadə edir. Bunları:
- `useMovies` / `tmdb.discoverMovies` / `tmdb.discoverTV` üzərinə keçirəcəm
- `MediaGrid` + `CategoryRow` istifadə edəcəm
- Janr filtrini TMDB genre ID ilə işlədəcəm
- `Cartoons` → animation janrı (16) ilə discover

### 3. Yeni səhifələr
- **OnboardingPage** — 3 addım: dil → sevimli janrlar (TMDB genre list) → sevimli aktyorlar (search). `user_preferences`-ə yazır, `onboarding_completed=true` qoyur.
- **ProfilePage** — profil başlığı, statistika (izlənən, reytinqlər), tab-lar: "Aktivlik", "Siyahılar", "İzlədiyi", "İzləyiciləri". `useFollow` ilə follow/unfollow.
- **WatchlistPage** — `useWatchlist` ilə MediaGrid.
- **HistoryPage** — `useWatchHistory` + davam et CTA.
- **ListsPage** + **ListDetailPage** — yaratma, item əlavə etmə, like.
- **NotificationsPage** — `useNotifications`, oxundu işarələmə.
- **FeedPage** — izlədiyi insanların `activity` cədvəlindən axın.
- **PersonPage** — `tmdb.personDetails`, filmoqrafiya.
- **GenrePage** — janr üzrə kəşf + filter (il, reytinq, sort).

### 4. AI Recommendations yenilənməsi
`supabase/functions/ai-recommendations/index.ts`:
- Lovable AI Gateway-ə keçəcək (`google/gemini-3-flash-preview`)
- İstifadəçinin `watch_history`, `ratings`, `user_preferences` kontekstindən oxuyacaq
- Tool calling ilə strukturlaşdırılmış output (title, tmdb_id, media_type, reason)
- 429/402 xəta idarəsi

`AIRecommend.tsx` səhifəsi və `AIRecommendations.tsx` komponenti yeni response formatına uyğunlaşdırılacaq.

### 5. Header & Navigation
- Search input bütün səhifələrdə → `/search?q=...` 
- Notification bell badge real-time
- Avatar dropdown: Profile, Watchlist, History, Lists, Settings, Logout

### 6. Onboarding redirect
`AuthContext`-ə kiçik yoxlama: login sonrası `user_preferences.onboarding_completed=false` olarsa `/onboarding`-a yönləndir.

### 7. Polish
- Loading skeleton-lar (`MediaGrid`-də artıq var, digər səhifələrə də əlavə)
- Empty state komponenti təkrar istifadə
- Toast bildirişləri (sonner)
- Mobil responsive yoxlanışı (BottomNav artıq var)

### Texniki qeydlər
- Bütün yeni səhifələr `Header` + (auth tələb edənlər) `ProtectedRoute` altında
- TMDB image helper: `tmdb.image.poster/backdrop/profile`
- React Query `staleTime: 5 * 60 * 1000` davamlı şəkildə
- Realtime: notifications artıq subscribe edir; activity feed üçün eyni pattern

### Sıra
1. App.tsx routing
2. Movies/Series/Cartoons miqrasiyası (mövcud sınıq vəziyyəti həll edir)
3. Onboarding + Profile + Watchlist + History
4. Lists + Notifications + Feed + Person + Genre
5. AI edge function + AIRecommend səhifəsi
6. Header search + avatar menu

### Qeyd
Bu həcm böyükdür — bəzi səhifələr ilkin versiyada minimal funksional olacaq (CRUD + grid), sonradan polish üçün yenidən baxıla bilər.

Təsdiq edirsinizsə, "davam et" yazın — sıra ilə tətbiq edəcəyəm.