import { Language } from "@/contexts/LanguageContext";

export const translations = {
  az: {
    // Auth
    signIn: "Daxil ol",
    signUp: "Qeydiyyat",
    email: "Email",
    password: "Şifrə",
    fullName: "Tam ad",
    alreadyHaveAccount: "Artıq hesabınız var?",
    dontHaveAccount: "Hesabınız yoxdur?",
    
    // Header
    signOut: "Çıxış",
    subscription: "Abunəlik",
    freeVersion: "Pulsuz",
    proVersion: "Pro",
    
    // Search
    searchPlaceholder: "Film, serial və ya çizgi film axtar...",
    search: "Axtar",
    
    // Movies
    movies: "Filmlər",
    series: "Seriallar",
    cartoons: "Çizgi Filmlər",
    year: "İl",
    type: "Növ",
    randomMovie: "Təsadüfi Film",
    
    // Empty State
    noResults: "Nəticə tapılmadı",
    tryDifferentSearch: "Başqa bir axtarış sözü daxil edin",
    
    // Common
    loading: "Yüklənir...",
    error: "Xəta baş verdi",
  },
  ru: {
    // Auth
    signIn: "Войти",
    signUp: "Регистрация",
    email: "Email",
    password: "Пароль",
    fullName: "Полное имя",
    alreadyHaveAccount: "Уже есть аккаунт?",
    dontHaveAccount: "Нет аккаунта?",
    
    // Header
    signOut: "Выйти",
    subscription: "Подписка",
    freeVersion: "Бесплатно",
    proVersion: "Pro",
    
    // Search
    searchPlaceholder: "Поиск фильмов, сериалов или мультфильмов...",
    search: "Искать",
    
    // Movies
    movies: "Фильмы",
    series: "Сериалы",
    cartoons: "Мультфильмы",
    year: "Год",
    type: "Тип",
    randomMovie: "Случайный фильм",
    
    // Empty State
    noResults: "Результаты не найдены",
    tryDifferentSearch: "Попробуйте другой запрос",
    
    // Common
    loading: "Загрузка...",
    error: "Произошла ошибка",
  },
  en: {
    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    
    // Header
    signOut: "Sign Out",
    subscription: "Subscription",
    freeVersion: "Free",
    proVersion: "Pro",
    
    // Search
    searchPlaceholder: "Search for movies, series or cartoons...",
    search: "Search",
    
    // Movies
    movies: "Movies",
    series: "Series",
    cartoons: "Cartoons",
    year: "Year",
    type: "Type",
    randomMovie: "Random Movie",
    
    // Empty State
    noResults: "No results found",
    tryDifferentSearch: "Try a different search query",
    
    // Common
    loading: "Loading...",
    error: "An error occurred",
  },
  it: {
    // Auth
    signIn: "Accedi",
    signUp: "Registrati",
    email: "Email",
    password: "Password",
    fullName: "Nome completo",
    alreadyHaveAccount: "Hai già un account?",
    dontHaveAccount: "Non hai un account?",
    
    // Header
    signOut: "Esci",
    subscription: "Abbonamento",
    freeVersion: "Gratuito",
    proVersion: "Pro",
    
    // Search
    searchPlaceholder: "Cerca film, serie o cartoni animati...",
    search: "Cerca",
    
    // Movies
    movies: "Film",
    series: "Serie",
    cartoons: "Cartoni Animati",
    year: "Anno",
    type: "Tipo",
    randomMovie: "Film Casuale",
    
    // Empty State
    noResults: "Nessun risultato trovato",
    tryDifferentSearch: "Prova una ricerca diversa",
    
    // Common
    loading: "Caricamento...",
    error: "Si è verificato un errore",
  },
  tr: {
    // Auth
    signIn: "Giriş Yap",
    signUp: "Kayıt Ol",
    email: "Email",
    password: "Şifre",
    fullName: "Tam Ad",
    alreadyHaveAccount: "Zaten hesabınız var mı?",
    dontHaveAccount: "Hesabınız yok mu?",
    
    // Header
    signOut: "Çıkış Yap",
    subscription: "Abonelik",
    freeVersion: "Ücretsiz",
    proVersion: "Pro",
    
    // Search
    searchPlaceholder: "Film, dizi veya çizgi film ara...",
    search: "Ara",
    
    // Movies
    movies: "Filmler",
    series: "Diziler",
    cartoons: "Çizgi Filmler",
    year: "Yıl",
    type: "Tür",
    randomMovie: "Rastgele Film",
    
    // Empty State
    noResults: "Sonuç bulunamadı",
    tryDifferentSearch: "Farklı bir arama yapın",
    
    // Common
    loading: "Yükleniyor...",
    error: "Bir hata oluştu",
  },
};

export const t = (key: keyof typeof translations.az, lang: Language): string => {
  return translations[lang][key] || translations.en[key] || key;
};
