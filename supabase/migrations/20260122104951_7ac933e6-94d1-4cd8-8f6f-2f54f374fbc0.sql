-- Create enums
CREATE TYPE public.film_genre AS ENUM ('drama', 'comedy', 'horror', 'scifi', 'documentary', 'animation', 'experimental', 'romance', 'thriller', 'fantasy');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_base TEXT DEFAULT 'default',
  avatar_accessories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Films table
CREATE TABLE public.films (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  synopsis TEXT,
  duration_minutes INTEGER NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  genres film_genre[] DEFAULT '{}',
  themes TEXT[] DEFAULT '{}',
  release_year INTEGER,
  director TEXT,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Film ratings
CREATE TABLE public.film_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10) NOT NULL,
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(film_id, user_id)
);

-- User favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, film_id)
);

-- Watch history
CREATE TABLE public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE NOT NULL,
  watched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress_seconds INTEGER DEFAULT 0
);

-- Discussions
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE SET NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Discussion comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Discussion likes
CREATE TABLE public.discussion_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

-- Comment likes
CREATE TABLE public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Private messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Films policies (public read)
CREATE POLICY "Films are viewable by everyone" ON public.films FOR SELECT USING (true);

-- Ratings policies
CREATE POLICY "Ratings are viewable by everyone" ON public.film_ratings FOR SELECT USING (true);
CREATE POLICY "Users can create own ratings" ON public.film_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.film_ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.film_ratings FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Watch history policies
CREATE POLICY "Users can view own history" ON public.watch_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to history" ON public.watch_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON public.watch_history FOR UPDATE USING (auth.uid() = user_id);

-- Discussions policies
CREATE POLICY "Discussions are viewable by everyone" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create discussions" ON public.discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own discussions" ON public.discussions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own discussions" ON public.discussions FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- Discussion likes policies
CREATE POLICY "Discussion likes viewable by everyone" ON public.discussion_likes FOR SELECT USING (true);
CREATE POLICY "Users can like discussions" ON public.discussion_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike discussions" ON public.discussion_likes FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes viewable by everyone" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments" ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments" ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update received messages" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_films_updated_at BEFORE UPDATE ON public.films FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_film_ratings_updated_at BEFORE UPDATE ON public.film_ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON public.discussions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate average rating
CREATE OR REPLACE FUNCTION public.get_film_average_rating(film_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
  FROM public.film_ratings
  WHERE film_id = film_uuid;
$$ LANGUAGE SQL STABLE;

-- Insert sample films
INSERT INTO public.films (title, synopsis, duration_minutes, video_url, thumbnail_url, genres, themes, release_year, director, is_featured) VALUES
('Rêves Urbains', 'Un voyage poétique à travers les rues de Paris au crépuscule, capturant l''essence de la vie moderne.', 12, 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, ARRAY['documentary', 'experimental']::film_genre[], ARRAY['urban', 'poetry', 'paris'], 2023, 'Marie Dubois', true),
('Le Dernier Train', 'Une rencontre inattendue entre deux inconnus dans un train de nuit change leur vie à jamais.', 18, 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, ARRAY['drama', 'romance']::film_genre[], ARRAY['love', 'journey', 'fate'], 2022, 'Jean-Pierre Martin', true),
('Cosmos Intérieur', 'Une exploration visuelle du subconscient humain mêlant animation et prises de vue réelles.', 8, 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, ARRAY['animation', 'experimental']::film_genre[], ARRAY['mind', 'dreams', 'abstract'], 2024, 'Sophie Laurent', false),
('La Boulangerie', 'Comédie touchante sur les tribulations d''un boulanger et ses clients excentriques.', 15, 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, ARRAY['comedy']::film_genre[], ARRAY['humor', 'community', 'france'], 2023, 'Lucas Bernard', false),
('Ombres Silencieuses', 'Un thriller psychologique où rien n''est ce qu''il semble être dans un village isolé.', 22, 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, ARRAY['thriller', 'horror']::film_genre[], ARRAY['suspense', 'mystery', 'rural'], 2024, 'Emma Petit', true),
('Fragments de Mémoire', 'Un documentaire intime sur les souvenirs d''enfance et leur impact sur notre identité adulte.', 25, 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, ARRAY['documentary']::film_genre[], ARRAY['memory', 'identity', 'nostalgia'], 2023, 'Antoine Moreau', false);