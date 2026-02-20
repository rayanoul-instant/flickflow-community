-- Add review likes table for thumbs up on reviews
CREATE TABLE public.review_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  rating_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, rating_id)
);

ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Review likes are viewable by everyone"
  ON public.review_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like reviews"
  ON public.review_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike reviews"
  ON public.review_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Make favorites publicly viewable (for user profiles)
CREATE POLICY "Favorites are viewable by everyone"
  ON public.favorites FOR SELECT
  USING (true);

-- Drop the old private-only policy
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;