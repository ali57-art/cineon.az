-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for user_subscriptions
CREATE POLICY "Admins can insert subscriptions"
ON public.user_subscriptions FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update subscriptions"
ON public.user_subscriptions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete subscriptions"
ON public.user_subscriptions FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to assign default user role
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.assign_default_role();

-- Create saved_filters table for user preferences
CREATE TABLE public.saved_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filter_name TEXT NOT NULL,
  filter_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.saved_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own filters"
ON public.saved_filters FOR ALL
USING (auth.uid() = user_id);

-- Create user_watchlist table
CREATE TABLE public.user_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  imdb_id TEXT NOT NULL,
  title TEXT NOT NULL,
  poster TEXT,
  type TEXT NOT NULL,
  year TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, imdb_id)
);

ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watchlist"
ON public.user_watchlist FOR ALL
USING (auth.uid() = user_id);

CREATE TRIGGER update_saved_filters_updated_at
BEFORE UPDATE ON public.saved_filters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();