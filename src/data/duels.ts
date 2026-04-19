export interface DuelMovie {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  rating: string;
  genre: string;
}

export interface Duel {
  date: string; // YYYY-MM-DD
  left: DuelMovie;
  right: DuelMovie;
}

// Rotating pool of duels — picked deterministically by date
const POOL: Duel[] = [
  {
    date: "",
    left: {
      imdbID: "tt1375666",
      title: "Inception",
      year: "2010",
      poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
      rating: "8.8",
      genre: "Sci-Fi, Action",
    },
    right: {
      imdbID: "tt0816692",
      title: "Interstellar",
      year: "2014",
      poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      rating: "8.7",
      genre: "Sci-Fi, Drama",
    },
  },
  {
    date: "",
    left: {
      imdbID: "tt0468569",
      title: "The Dark Knight",
      year: "2008",
      poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
      rating: "9.0",
      genre: "Action, Crime",
    },
    right: {
      imdbID: "tt0114369",
      title: "Se7en",
      year: "1995",
      poster: "https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      rating: "8.6",
      genre: "Crime, Thriller",
    },
  },
  {
    date: "",
    left: {
      imdbID: "tt0110912",
      title: "Pulp Fiction",
      year: "1994",
      poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      rating: "8.9",
      genre: "Crime, Drama",
    },
    right: {
      imdbID: "tt0102926",
      title: "The Silence of the Lambs",
      year: "1991",
      poster: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGI0ZTViXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      rating: "8.6",
      genre: "Crime, Thriller",
    },
  },
  {
    date: "",
    left: {
      imdbID: "tt0109830",
      title: "Forrest Gump",
      year: "1994",
      poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
      rating: "8.8",
      genre: "Drama, Romance",
    },
    right: {
      imdbID: "tt0111161",
      title: "The Shawshank Redemption",
      year: "1994",
      poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      rating: "9.3",
      genre: "Drama",
    },
  },
  {
    date: "",
    left: {
      imdbID: "tt0133093",
      title: "The Matrix",
      year: "1999",
      poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      rating: "8.7",
      genre: "Sci-Fi, Action",
    },
    right: {
      imdbID: "tt0080684",
      title: "Star Wars: Empire Strikes Back",
      year: "1980",
      poster: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      rating: "8.7",
      genre: "Sci-Fi, Adventure",
    },
  },
  {
    date: "",
    left: {
      imdbID: "tt0167260",
      title: "LOTR: Return of the King",
      year: "2003",
      poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      rating: "9.0",
      genre: "Fantasy, Adventure",
    },
    right: {
      imdbID: "tt0120737",
      title: "LOTR: Fellowship of the Ring",
      year: "2001",
      poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
      rating: "8.9",
      genre: "Fantasy, Adventure",
    },
  },
  {
    date: "",
    left: {
      imdbID: "tt0068646",
      title: "The Godfather",
      year: "1972",
      poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      rating: "9.2",
      genre: "Crime, Drama",
    },
    right: {
      imdbID: "tt0071562",
      title: "The Godfather Part II",
      year: "1974",
      poster: "https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      rating: "9.0",
      genre: "Crime, Drama",
    },
  },
];

export const getTodayDuel = (): Duel => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const idx = dayOfYear % POOL.length;
  const dateStr = today.toISOString().split("T")[0];
  return { ...POOL[idx], date: dateStr };
};

export const getCommunityResult = (date: string): { leftPct: number; rightPct: number } => {
  // Deterministic pseudo-random based on date
  let hash = 0;
  for (let i = 0; i < date.length; i++) hash = (hash << 5) - hash + date.charCodeAt(i);
  const left = 30 + (Math.abs(hash) % 41); // 30..70
  return { leftPct: left, rightPct: 100 - left };
};
