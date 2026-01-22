-- Create increment functions
CREATE OR REPLACE FUNCTION public.increment_view_count(film_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.films SET view_count = view_count + 1 WHERE id = film_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.increment_comments_count(discussion_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.discussions SET comments_count = comments_count + 1 WHERE id = discussion_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;