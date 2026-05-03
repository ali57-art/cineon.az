import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Cartoons from "./pages/Cartoons";
import Random from "./pages/Random";
import AIRecommend from "./pages/AIRecommend";
import Duel from "./pages/Duel";
import MovieDetailPage from "./pages/MovieDetailPage";
import TVDetailPage from "./pages/TVDetailPage";
import SearchPage from "./pages/SearchPage";
import Onboarding from "./pages/Onboarding";
import Watchlist from "./pages/Watchlist";
import History from "./pages/History";
import Lists from "./pages/Lists";
import ListDetail from "./pages/ListDetail";
import Notifications from "./pages/Notifications";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Person from "./pages/Person";
import Genre from "./pages/Genre";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/series" element={<Series />} />
                <Route path="/cartoons" element={<Cartoons />} />
                <Route path="/random" element={<Random />} />
                <Route path="/ai-recommend" element={<AIRecommend />} />
                <Route path="/duel" element={<Duel />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
                <Route path="/tv/:id" element={<TVDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/person/:id" element={<Person />} />
                <Route path="/genre/:type/:id" element={<Genre />} />
                <Route path="/profile/:username" element={<Profile />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/lists" element={<Lists />} />
                  <Route path="/lists/:id" element={<ListDetail />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/feed" element={<Feed />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
