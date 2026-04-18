
Bu çox böyük və hərtərəfli bir spec — 11 prompt, faktiki olaraq tam yenidən qurulma. Bütün şeyi bir mesajda etmək keyfiyyət baxımından risklidir, ona görə də mərhələ-mərhələ bölürəm. İlk mesajda bu **PROMPT 1 + 2 + 11 (qismən)** üçün konkret plan təqdim edirəm — bu, brendin əsasını qoyur və qalan promptlar üçün möhkəm zəmin yaradır. Qalanları sonrakı mesajlarda ardıcıl edəcəyik.

## Vacib texniki düzəlişlər (spec-dən fərqli edəcəyim şeylər)

1. **AI provider**: Spec Anthropic Claude API-ni birbaşa brauzerdən çağırmağı təklif edir (`anthropic-dangerous-direct-browser-calls: true` + `VITE_ANTHROPIC_API_KEY`). Bu **təhlükəsizlik baxımından səhvdir** — API açarı bütün istifadəçilərə görünər və oğurlana bilər. Bu layihədə artıq **Lovable AI** + Edge Functions (`ai-recommendations`, `ai-movie-review`, `ai-similar-movies`, `ai-watch-plan`, `ai-movie-summary`) qurulub və `LOVABLE_API_KEY` server tərəfində saxlanılır. Mövcud sistemi genişləndirəcəyik, Anthropic-ə keçməyəcəyik. İstifadəçidən API açarı istəməyə ehtiyac yoxdur.
2. **Şriftlər**: Spec Oswald + Nunito Sans istəyir. Hazırda Bebas Neue + DM Sans var (əvvəlki mərhələdə qurulmuşdu). Yeni spec-ə uyğun dəyişəcəyik — Azərbaycan diakritikləri (ə,ğ,ı,ö,ü,ç,ş) üçün Nunito Sans daha yaxşıdır.
3. **Watchlist**: Spec localStorage istəyir, amma Lovable Cloud + auth artıq qurulub. İstifadəçi bunu sonrakı mərhələdə dəqiqləşdirəcək — hələlik mövcud auth-a toxunmuruq.

## Bu mesajda görəcəyim iş — Faza A: Brand v2 əsası

### 1. Şrift sistemi yenilənməsi
- `index.html` — Google Fonts link-ini Oswald + Nunito Sans + Space Mono ilə əvəz et
- `tailwind.config.ts` — `fontFamily` təzələ:
  - `display: ['Oswald', ...]`
  - `sans: ['Nunito Sans', ...]`
  - `mono: ['Space Mono', ...]`
- `src/index.css` — başlıqlar üçün `letter-spacing: 0.02em`

### 2. Rəng tokeni dəqiqləşdirməsi
- Mövcud HSL token sistemi saxlanır (Tailwind ilə uyğun), amma yeni spec rəngləri ilə incə tənzimləmə:
  - `--card: #1C1C2A` → HSL
  - `--background: #0A0A0F` (var)
  - `--primary: #E63946` (var)
- Yeni utility: `bg-cineon-surface` istəmirəm — mövcud `card`/`background`/`muted` token-lərinə güvənək

### 3. Navbar yenidən dizayn (`Header.tsx`)
- Sol: Loqo (mövcud "Cine[reel]n" qalır — yaxşı işləyir)
- Orta (desktop): nav linklər — `Əsas Səhifə`, `Kəşfet`, `Top Filmlər`, `AI Tövsiyə`
  - Mövcud `Navigation.tsx` komponentini header-ə inteqrasiya et və ya saxla — qərar: ayrı saxla, amma label-ləri yenilə
- Sağ: 🔍 axtar, ❤️ favoritlər (placeholder), 📋 siyahı (placeholder), Pro badge, dil, çıxış
- Scroll zamanı kölgə: `useState` + `scroll` listener ilə `box-shadow` əlavə et
- `backdrop-filter: blur(20px)` artıq var

### 4. Hero section yenidən dizayn (`src/pages/Index.tsx`)
- Fullwidth gradient: `linear-gradient(135deg, #0A0A0F 0%, #1A0A0F 50%, #0F0A1A 100%)`
- Pure-CSS animated particle effect (kiçik ulduz nöqtələri, `@keyframes` ilə float)
- Başlıq: "SƏNİN KİNON" — Oswald 900, responsive (88px desktop / 48px mobile)
- Alt: "Minlərlə film. Bir klik. Sənin seçiminlə."
- 2 CTA:
  - `[🎬 Filmlərə Bax]` → `/movies`
  - `[🤖 AI ilə Film Tap]` → `/ai-recommend` (sonrakı mərhələdə yaradılacaq, hələlik `/random` və ya disabled)
- Min height: `85vh`
- Scroll-down indicator: animasiyalı chevron

### 5. Yeni route placeholder
- `/ai-recommend` route-u — əsl səhifə Faza B-də qurulacaq, hələlik sadə "Tezliklə" placeholder

### 6. Naviqasiya label-ləri
- `Navigation.tsx` mövcud — `Əsas Səhifə`, `Kəşfet` (Movies), `AI Tövsiyə` daxil et
- i18n tərcümələrinə yeni açar `aiRecommend` əlavə et

## Toxunulacaq fayllar

- `index.html` (şrift link)
- `tailwind.config.ts` (fontFamily)
- `src/index.css` (letter-spacing, particle keyframes, hero gradient utility)
- `src/components/Header.tsx` (scroll shadow, nav linklər)
- `src/components/Navigation.tsx` (label yeniləmə, AI link əlavəsi)
- `src/pages/Index.tsx` (hero section v2)
- `src/i18n/translations.ts` (yeni açarlar)
- `src/App.tsx` (`/ai-recommend` placeholder route)
- Yeni: `src/pages/AIRecommend.tsx` (sadə placeholder)

## Bu mərhələdə ETMƏYƏCƏYİM (sonrakı mesajlarda)

- **Faza B**: AI Tövsiyə səhifəsi (Lovable AI ilə, Anthropic deyil) + film detal AI tab-ları
- **Faza C**: Axtarış/filtr genişləndirilməsi (range slider, URL state)
- **Faza D**: Watchlist v2 (auth ilə Cloud-da, localStorage deyil — bunu istifadəçidən təsdiq alacağam)
- **Faza E**: Ana səhifə bölmələri (Trend, Top 10, Gizli Xəzinələr)
- **Faza F**: AI Quiz wizard
- **Faza G**: Mobile bottom nav + swipe + light theme

## Risklər və qeydlər

- Spec-də `VITE_ANTHROPIC_API_KEY` və brauzerdən birbaşa Claude çağırışı **TƏHLÜKƏSİZDİR** — etməyəcəyik. Bunun yerinə mövcud Lovable AI edge function-ları genişləndirəcəyik.
- Watchlist üçün localStorage tələbi auth ilə ziddiyyətdədir — Faza D başlamazdan əvvəl seçim soruşacağam (cloud sync vs localStorage).
- Mövcud `Bebas Neue` istifadə edən komponentlər (Header loqosu, Footer) Oswald-a keçəcək — vizual yüngül dəyişiklik gözlənilir.

Təsdiq versəniz, Faza A-nı tətbiq edib sonra Faza B (AI Tövsiyə səhifəsi) üçün ayrı mesajda davam edəcəyəm.
