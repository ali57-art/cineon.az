
İstifadəçi v3 spec göndərib — 12 prompt, faktiki olaraq tam premium yenidən qurulma. Bu çox böyükdür və bir mesajda hər şeyi etmək keyfiyyəti pozar. Mərhələ-mərhələ gedirik.

## Vacib qeydlər

1. **AI provider**: Spec yenə də Anthropic-i brauzerdən birbaşa çağırmağı təklif edir (`anthropic-dangerous-direct-browser-calls`, `localStorage`-də açar). Bu **təhlükəsizlik baxımından səhvdir** — açar bütün istifadəçilərə açıq olar. İstifadəçi "öz AI API-sini əlavə edəcəm" dedi — bunu bir az sonra (öz açarını verəndə) edge function secret kimi əlavə edəcəyik. Hələlik Lovable AI saxlayıram.

2. **Watchlist**: Spec localStorage istəyir, amma layihədə Cloud auth var. Müvəqqəti localStorage işlədəcəyik (Düello, Sarmal, Quiz, Təqvim üçün) — sonra istəsə Cloud-a köçürərik.

3. **AZ Kino dataları**: Statik massiv (poster yoxdur, placeholder) — sonra OMDb varsa zənginləşdirilə bilər.

## Bu mesajda görəcəyim iş — Faza C: Dizayn sistemi v3 + Premium MovieCard + 1 yeni səhifə

Ən böyük vizual təsir verən hissələri seçirəm ki, sayt birdən-birə "premium" görünsün:

### 1. Dizayn sistemi v3 (PROMPT 01)
- `index.html` — Google Fonts artıq düzdür, saxla
- `src/index.css` — yeni rəng tokenləri (HSL formatda Tailwind ilə uyğun), animasiyalar (`fadeUp`, `pulse-red`, `shimmer`), scrollbar, selection, ease/duration dəyişənləri
- `tailwind.config.ts` — yeni token-ləri Tailwind theme-ə bağla (gold, red-glow, shadow-red, ease-spring)

### 2. Navbar yeniləmə (PROMPT 02)
- `Header.tsx` — logo-ya pulsing red dot əlavə et
- `Navigation.tsx` — AI link-ə xüsusi border + qırmızı stil
- Yeni: `BottomNav.tsx` — mobil üçün fixed bottom bar (Home, Search, AI, List, Profile)
- `App.tsx`-ə BottomNav-ı daxil et (yalnız mobil-də görünür)

### 3. Premium MovieCard (PROMPT 04)
- `MovieCard.tsx`-i tam yenidən yaz:
  - Hover-da poster qaralır + scale
  - Üstdə: IMDb badge (qızıl, mono font) + il badge
  - Ortada: janr taglar
  - Aşağıda: 3 dairəvi action düymə (+, ♥, ✓) + "Ətraflı" düyməsi
  - Kartın altında ad + meta
- Hover overlay opacity transition

### 4. Ana səhifə zənginləşdirilməsi (PROMPT 03 - qismən)
- `Index.tsx`-ə **statistika sətri** (Hero-dan sonra): 4 stat (10K+ Film, 2M+ Reytinq, AI, AZ)
- **Top 10 list** bölməsi (numbered, böyük rəqəmlərlə) — OMDb-dən populyar filmlər
- **AI CTA bloku** (full-width, qırmızı gradient kart) — artıq var, yeniləyim

### 5. Film Düellosu (PROMPT 05) — yeni səhifə
- Yeni: `src/pages/Duel.tsx`
- `App.tsx`-ə `/duel` route
- Naviqasiyaya "Düello" linki
- Hardcoded 7 günlük cütlük massivi (məşhur filmlər)
- Tarixə görə cari düello, iki kart yan-yana, "VS" ortada
- Seçim → localStorage-də saxla, hardcoded icma faizi göstər (məsələn random 30-70%)
- Geri sayım taymeri (gecə yarısına qədər)
- Tərcümə açarları əlavə et

### 6. Tərcümələr
- `translations.ts`-ə yeni açarlar: `duel`, `chooseFilm`, `communityChose`, `topTen`, `stats.films`, `stats.ratings` və s.

## Toxunulacaq fayllar

- `src/index.css` (yeni tokenlər, animasiyalar, scrollbar)
- `tailwind.config.ts` (yeni theme tokens)
- `src/components/Header.tsx` (logo dot)
- `src/components/Navigation.tsx` (AI link stili)
- `src/components/MovieCard.tsx` (premium yenidən yazma)
- `src/pages/Index.tsx` (statistika + Top 10 bölmələri)
- `src/i18n/translations.ts` (yeni açarlar)
- `src/App.tsx` (`/duel` route + BottomNav)
- Yeni: `src/components/BottomNav.tsx`
- Yeni: `src/pages/Duel.tsx`
- Yeni: `src/data/duels.ts` (hardcoded düello cütlükləri)

## Etməyəcəyim (sonrakı mərhələlərdə)

- **Faza D**: Kino Təqvimi + Cineon Sarmalı + Quiz (localStorage statistikası tələb edir — auth ilə inteqrasiya soruşacağam)
- **Faza E**: AZ Kino kataloqu (böyük statik data + ayrı UI)
- **Faza F**: Gizli Faktlar AI tab (mövcud edge function-a yeni endpoint əlavə)
- **Faza G**: Toast + scroll reveal + page transitions + 404 redesign + scroll-to-top
- **Faza H**: PWA manifest + SEO meta + Error Boundary + lazy loading

## Risklər

- **Anthropic API açarını brauzerdə saxlamaq tələbi rədd ediləcək** — istifadəçi öz açarını verəndə edge function-a Supabase secret kimi əlavə edəcəyik. Bu, security baxımından yeganə düzgün yoldur.
- Bütün spec-i bir mesajda etmək = aşağı keyfiyyət. 4-5 mərhələyə bölürük.
- Hardcoded data (düellolar, AZ filmlər) sonra OMDb və ya verilənlər bazasına köçürülə bilər.

Təsdiq versəniz Faza C-ni başlayıram. Sonrakı mesajda Faza D və s. davam edəcəyik.
