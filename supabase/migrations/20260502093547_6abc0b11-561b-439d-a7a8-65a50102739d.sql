
-- ============================================================
-- 1. Mövcud cədvəlləri genişləndir
-- ============================================================

-- profiles: username, bio, subscription
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- user_watchlist: TMDB media_id + media_type
ALTER TABLE public.user_watchlist
  ADD COLUMN IF NOT EXISTS media_id INTEGER,
  ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('movie','tv'));

CREATE INDEX IF NOT EXISTS idx_watchlist_media ON public.user_watchlist(user_id, media_id, media_type);

-- profiles ictimai görünüş üçün əlavə policy
DROP POLICY IF EXISTS "Public profiles viewable by all" ON public.profiles;
CREATE POLICY "Public profiles viewable by all"
  ON public.profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);

-- ============================================================
-- 2. watch_history
-- ============================================================
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie','tv')),
  season_number INTEGER,
  episode_number INTEGER,
  progress_seconds INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  watched_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_history_user ON public.watch_history(user_id, watched_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_history_unique
  ON public.watch_history(user_id, media_id, media_type, COALESCE(season_number, -1), COALESCE(episode_number, -1));

ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own history" ON public.watch_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 3. ratings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie','tv')),
  rating NUMERIC(3,1) CHECK (rating >= 0 AND rating <= 10),
  review TEXT,
  spoiler BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, media_id, media_type)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users insert own ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own ratings" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own ratings" ON public.ratings FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. user_preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_genres INTEGER[] DEFAULT '{}',
  disliked_genres INTEGER[] DEFAULT '{}',
  favorite_actors INTEGER[] DEFAULT '{}',
  preferred_languages TEXT[] DEFAULT ARRAY['az','en'],
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own prefs" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_prefs_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. lists + list_items + list_likes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View public or own lists" ON public.lists FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users insert own lists" ON public.lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own lists" ON public.lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own lists" ON public.lists FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON public.lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie','tv')),
  notes TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(list_id, media_id, media_type)
);
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View items of accessible lists" ON public.list_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.lists l WHERE l.id = list_id AND (l.is_public OR l.user_id = auth.uid())));
CREATE POLICY "Owner manages items" ON public.list_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.lists l WHERE l.id = list_id AND l.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.lists l WHERE l.id = list_id AND l.user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.list_likes (
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (list_id, user_id)
);
ALTER TABLE public.list_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON public.list_likes FOR SELECT USING (true);
CREATE POLICY "Users like" ON public.list_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike" ON public.list_likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 6. follows
-- ============================================================
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================================
-- 7. activity feed
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'watched' | 'rated' | 'list_created' | 'followed'
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_user ON public.activity(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity(created_at DESC);

ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view activity" ON public.activity FOR SELECT USING (true);
CREATE POLICY "Users insert own activity" ON public.activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own activity" ON public.activity FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 8. notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON public.notifications(user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System inserts notifications" ON public.notifications FOR INSERT WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================================
-- 9. Activity auto-write triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_TABLE_NAME = 'ratings' THEN
    INSERT INTO public.activity(user_id, type, payload)
    VALUES (NEW.user_id, 'rated', jsonb_build_object(
      'media_id', NEW.media_id, 'media_type', NEW.media_type, 'rating', NEW.rating
    ));
  ELSIF TG_TABLE_NAME = 'watch_history' AND NEW.completed = true THEN
    INSERT INTO public.activity(user_id, type, payload)
    VALUES (NEW.user_id, 'watched', jsonb_build_object(
      'media_id', NEW.media_id, 'media_type', NEW.media_type
    ));
  ELSIF TG_TABLE_NAME = 'lists' THEN
    INSERT INTO public.activity(user_id, type, payload)
    VALUES (NEW.user_id, 'list_created', jsonb_build_object('list_id', NEW.id, 'name', NEW.name));
  ELSIF TG_TABLE_NAME = 'follows' THEN
    INSERT INTO public.activity(user_id, type, payload)
    VALUES (NEW.follower_id, 'followed', jsonb_build_object('following_id', NEW.following_id));
    INSERT INTO public.notifications(user_id, type, title, body, data)
    VALUES (NEW.following_id, 'new_follower', 'Yeni izləyici', 'Sizi yeni biri izləməyə başladı',
            jsonb_build_object('follower_id', NEW.follower_id));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_rating ON public.ratings;
CREATE TRIGGER trg_log_rating AFTER INSERT ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

DROP TRIGGER IF EXISTS trg_log_watched ON public.watch_history;
CREATE TRIGGER trg_log_watched AFTER UPDATE ON public.watch_history
  FOR EACH ROW WHEN (NEW.completed = true AND (OLD.completed IS DISTINCT FROM NEW.completed))
  EXECUTE FUNCTION public.log_activity();

DROP TRIGGER IF EXISTS trg_log_list ON public.lists;
CREATE TRIGGER trg_log_list AFTER INSERT ON public.lists
  FOR EACH ROW WHEN (NEW.is_public = true) EXECUTE FUNCTION public.log_activity();

DROP TRIGGER IF EXISTS trg_log_follow ON public.follows;
CREATE TRIGGER trg_log_follow AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

-- ============================================================
-- 10. handle_new_user yenilənir — user_preferences də yaradılsın
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8))
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_subscriptions (user_id, subscription_type)
  VALUES (NEW.id, 'free') ON CONFLICT DO NOTHING;

  INSERT INTO public.user_preferences (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
