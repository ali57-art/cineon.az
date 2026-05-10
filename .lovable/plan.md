## Məqsəd

Cineon-u tam izlənilə bilən platformaya çevirmək: **VidSrc embed pleyeri**, **mobile-first responsiv** dizayn (mobil/planşet/desktop) və əvvəlki promtdan qalan kiçik tamamlamalar.

---

## 1. Video Pleyer (VidSrc)

**`src/services/videoProvider.ts`** — VidSrc URL-lərini qaytaracaq:
- Movie: `https://vidsrc.xyz/embed/movie/{tmdb_id}`
- TV: `https://vidsrc.xyz/embed/tv/{tmdb_id}/{season}/{episode}`
- Fallback domain: `vidsrc.to`
- `type: "iframe"` qaytarır

**`src/pages/WatchPage.tsx`** (yeni) — fullscreen pleyer səhifəsi:
- Route: `/watch/movie/:id` və `/watch/tv/:id/:season/:episode`
- Üst panel: geri düyməsi, başlıq, TV üçün epizod seçici (Select)
- Mərkəz: 16:9 iframe (mobildə tam en, desktopda max 1280px)
- Alt panel (TV): "Növbəti epizod" düyməsi, epizodlar siyahısı (collapsible)
- `useWatchHistory` ilə açılışda avtomatik qeyd
- Loading skeleton, iframe sandbox attributes, fullscreen API düyməsi

**Routing** (`src/App.tsx`): yeni `/watch/...` mar­şrutları əlavə.

**Detail səhifələrindəki "İzlə" düyməsi** artıq `/watch/...` route-una yönləndirir (artıq belədir, yoxlanılacaq).

---

## 2. Mobile-First Responsiv Yenidən Baxış

3 breakpoint: **mobil (< 640)**, **planşet (640-1024)**, **desktop (≥ 1024)**.

### Header (`src/components/Header.tsx`)
- Mobil: yığcam logo + axtarış ikonu + bell + avatar; naviqasiya hamburger menyu (Sheet)
- Planşet: kompakt nav + axtarış sahəsi
- Desktop: tam nav + geniş axtarış

### BottomNav (`src/components/BottomNav.tsx`)
- Mövcud, yalnız `md:hidden` — mobil + planşet portretdə görünsün (`lg:hidden`-ə dəyiş)
- Safe-area paddings yoxlanılacaq

### MediaGrid (`src/components/MediaGrid.tsx`)
- Hazırda: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
- Yeniləmə: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6` + `gap-3 sm:gap-4`

### HeroBanner
- Mobil: hündürlük `h-[60vh]`, mətn ölçüsü kiçildilir, CTA düymələri tam en
- Desktop: `h-[80vh]`, böyük tipoqrafiya

### Detail səhifələri (Movie/TV)
- Hero grid: mobildə tək sütun, poster mərkəzdə, başlıq aşağıda
- Tabs: mobildə horizontal scroll
- Cast row: artıq overflow-x scroll — toxunma ilə sürüşmə yoxlanılacaq
- Düymələr: mobildə `w-full sm:w-auto`

### CategoryRow
- Mobildə kart eni daha kiçik (`w-[140px] sm:w-[160px] md:w-[180px]`)
- Scroll snap əlavə

### Container paddings
- Bütün `container mx-auto px-4` → `px-3 sm:px-4 md:px-6` ardıcıl

### Modallar (TrailerModal, MovieModal)
- Mobildə `max-w-[95vw]`, kənarlardan padding

### Forms (Auth, Onboarding, Lists)
- Input/button-lar `h-11` toxunma üçün, mobildə tam en

### Bottom safe-area
- Bütün səhifələrdə `pb-20 lg:pb-12` (BottomNav-ə görə)

---

## 3. Qalan Promt Tamamlamaları

- **`src/pages/AIRecommend.tsx`** — TMDB bazasında işləməsini yoxla (artıq edge function var)
- **Onboarding redirect** — `AuthContext`-ə `onboarding_completed=false` yoxlaması əlavə et, login sonrası `/onboarding`-a yönləndir
- **Notifications real-time** — toast + bell badge yoxlanılacaq
- **Empty state-lər** — Watchlist, History, Lists, Feed üçün gözəl boş hal komponenti (`EmptyState.tsx` mövcuddur, istifadə edilməsi yoxlanılacaq)
- **Console error təmizliyi** — preview-də runtime error-ları yoxla
- **A11y** — pleyer və modallarda focus trap, aria-label-lar

---

## Texniki Detallar

```text
src/
├── pages/WatchPage.tsx          [YENİ] - fullscreen iframe pleyer
├── services/videoProvider.ts    [DƏYİŞ] - VidSrc URL-ləri
├── App.tsx                       [DƏYİŞ] - /watch/* route-ları
├── components/
│   ├── Header.tsx                [DƏYİŞ] - hamburger + responsiv
│   ├── BottomNav.tsx             [DƏYİŞ] - lg:hidden
│   ├── MediaGrid.tsx             [DƏYİŞ] - xl:grid-cols-6
│   ├── HeroBanner.tsx            [DƏYİŞ] - mobil tipoqrafiya
│   └── CategoryRow.tsx           [DƏYİŞ] - kiçik kart, snap
└── pages/
    ├── MovieDetailPage.tsx       [DƏYİŞ] - mobil layout
    ├── TVDetailPage.tsx          [DƏYİŞ] - mobil layout
    └── (digər səhifələr)         [DƏYİŞ] - container padding, pb-20

VidSrc qeydi: pulsuz embed provayderidir, lisenziyalı deyil — istehsal mühitində öz provayderinizlə əvəz edə bilərsiniz (URL-i `videoProvider.ts`-də tək yerdə dəyişmək kifayətdir).
```

---

## QA Checklist (sonda)

- [ ] 360px, 768px, 1280px, 1920px-də hər səhifə yoxlanılır
- [ ] /watch/movie/{id} açılır və oynayır
- [ ] /watch/tv/{id}/1/1 açılır, epizod dəyişimi işləyir
- [ ] BottomNav iPhone safe-area-ya uyğun
- [ ] Console-da error/warning yoxdur
