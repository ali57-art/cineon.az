
İstifadəçi 3 şey istəyir:
1. Bütün emojiləri Lucide ikonları ilə əvəz et
2. Spec-in qalan hissəsini davam etdir (Faza C-G)
3. Seriallar bölməsini də işlək et
4. Öz AI API-sini əlavə edəcək

Spec çox böyükdür — bir mesajda hər şeyi etmək olmaz. Əvvəlcə fokuslu bir mərhələ təklif edirəm.

**Qeyd AI API haqqında:** Layihədə artıq Lovable AI işləyir (LOVABLE_API_KEY pre-configured). İstifadəçi öz API açarını əlavə etmək istəyir — bu, Anthropic Claude və ya OpenAI ola bilər. Bunu aydınlaşdırmaq lazımdır, amma plan-da default olaraq mövcud Lovable AI saxlayıram, istifadəçi sonra dəyişə bilər.

## Bu mərhələdə görəcəyim iş

### 1. Emoji → Lucide ikon əvəzlənməsi (bütün sayt)
Tarama ilə tapılan emoji yerləri:
- `AIRecommend.tsx` — mood chips (😂 🔥 👻 🚀 💕 🧠 👨‍👩‍👧 🎭 ⚡ 😢) → Laugh, Flame, Ghost, Rocket, Heart, Brain, Users, Drama, Zap, CloudRain
- `Index.tsx` — hero CTA (🎬 🤖) → Film, Bot
- `Navigation.tsx` — nav linklər varsa
- `Footer.tsx` — sosial/badge ikonları
- `Header.tsx` — istifadəçi düymələri
- `translations.ts` — emoji daxil edən label-ləri təmizlə (yalnız mətn qalsın, ikon ayrı render edilsin)
- `MovieCard.tsx`, `MovieModal.tsx` — varsa
- Toast mesajlarındakı emojiləri sil

### 2. Seriallar üçün AI Tövsiyə dəstəyi
- `AIRecommend.tsx`-ə **content type toggle** əlavə et: `[Filmlər] [Seriallar] [Hər ikisi]`
- Edge function `ai-recommendations` artıq `type` parametrini qəbul edir — frontend-dən göndər
- Sistem prompt-unu yenilə ki, type-a görə film/serial/hər ikisi tövsiyə etsin
- Nəticə kartlarındakı "Axtar" düyməsi type-a görə `/movies` və ya `/series`-ə yönləndirsin
- Hər tövsiyə kartında type badge: "Film" və ya "Serial"

### 3. Faza E (qismən) — Ana səhifəyə Janr Kəşfi grid-i
- `Index.tsx`-ə Hero-dan sonra "Janra Görə Kəşfet" bölməsi əlavə et
- 3x3 grid (mobile 2x4), hər janr üçün gradient kart + Lucide ikon
- Tıklayanda `/movies?genre=X` və ya search-ə yönləndirsin
- Mövcud trending bölməsindən əvvəl və ya sonra yerləşdir

### 4. Toxunulacaq fayllar
- `src/pages/AIRecommend.tsx` — emoji-siz mood chips + type toggle + serial dəstəyi
- `src/pages/Index.tsx` — emoji-siz CTA + janr grid
- `src/components/Navigation.tsx` — emoji yoxla
- `src/components/Footer.tsx` — emoji yoxla
- `src/components/Header.tsx` — emoji yoxla
- `src/components/MovieCard.tsx` — yoxla
- `src/i18n/translations.ts` — emoji-li label-ləri təmizlə
- `supabase/functions/ai-recommendations/index.ts` — type parametrini sistem prompt-a daxil et
- Yeni: `src/components/GenreGrid.tsx` — yenidən istifadə üçün

## Etməyəcəyim (sonrakı mərhələlərdə)

- Faza C: range slider filtrləri (IMDb, il)
- Faza D: Watchlist (auth ilə Cloud-da, yoxsa localStorage? — soruşacağam sonra)
- Faza F: Multi-step AI Quiz wizard
- Faza G: Mobile bottom nav, light theme, swipe gestures
- Trailer embed, AI Q&A tab, Top 10 səhifəsi

## "Öz AI API-sini əlavə edəcəm" haqqında qeyd

Mövcud sistem **Lovable AI**-dir (LOVABLE_API_KEY) və işləyir. Əgər istifadəçi Anthropic Claude və ya OpenAI açarı əlavə etmək istəyirsə, bunu **edge function-da** secret kimi saxlamaq lazımdır (kod-da yox, brauzerdə yox — təhlükəsizlik üçün). Bu mərhələdə mövcud Lovable AI-də qalıram. İstifadəçi konkret hansı provider-i istədiyini bildirsin — onda secret tool-u ilə açar əlavə edib edge function-u yeniləyəcəyik.

Təsdiq versəniz başlayıram.
