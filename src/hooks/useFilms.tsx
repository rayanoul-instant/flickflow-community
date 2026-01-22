import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Film, FilmGenre, FilmRating } from '@/types/database';
import { useAuth } from './useAuth';

export function useFilms(filters?: {
  genre?: FilmGenre;
  search?: string;
  sortBy?: 'newest' | 'popular' | 'rating';
}) {
  return useQuery({
    queryKey: ['films', filters],
    queryFn: async () => {
      let query = supabase
        .from('films')
        .select('*');

      if (filters?.genre) {
        query = query.contains('genres', [filters.genre]);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,synopsis.ilike.%${filters.search}%,director.ilike.%${filters.search}%`);
      }

      if (filters?.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (filters?.sortBy === 'popular') {
        query = query.order('view_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Film[];
    },
  });
}

export function useFeaturedFilms() {
  return useQuery({
    queryKey: ['films', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .eq('is_featured', true)
        .limit(5);
      
      if (error) throw error;
      return data as Film[];
    },
  });
}

export function useFilm(id: string) {
  return useQuery({
    queryKey: ['film', id],
    queryFn: async () => {
      const { data: film, error } = await supabase
        .from('films')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;

      // Get average rating
      const { data: avgData } = await supabase
        .rpc('get_film_average_rating', { film_uuid: id });

      return { ...film, average_rating: avgData || 0 } as Film;
    },
    enabled: !!id,
  });
}

export function useFilmRatings(filmId: string) {
  return useQuery({
    queryKey: ['film-ratings', filmId],
    queryFn: async () => {
      // First get ratings
      const { data: ratings, error } = await supabase
        .from('film_ratings')
        .select('*')
        .eq('film_id', filmId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Then get profiles for each rating
      const ratingsWithProfiles = await Promise.all(
        (ratings || []).map(async (rating) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', rating.user_id)
            .single();
          
          return {
            ...rating,
            profile: profile || { username: 'Utilisateur' }
          };
        })
      );

      return ratingsWithProfiles as (FilmRating & { profile: { username: string } })[];
    },
    enabled: !!filmId,
  });
}

export function useRateFilm() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ filmId, rating, review }: { filmId: string; rating: number; review?: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('film_ratings')
        .upsert({
          film_id: filmId,
          user_id: user.id,
          rating,
          review,
        }, {
          onConflict: 'film_id,user_id',
        });

      if (error) throw error;
    },
    onSuccess: (_, { filmId }) => {
      queryClient.invalidateQueries({ queryKey: ['film-ratings', filmId] });
      queryClient.invalidateQueries({ queryKey: ['film', filmId] });
    },
  });
}

export function useFavorites() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;

      // Get films for each favorite
      const favoritesWithFilms = await Promise.all(
        (favorites || []).map(async (fav) => {
          const { data: film } = await supabase
            .from('films')
            .select('*')
            .eq('id', fav.film_id)
            .single();
          
          return { ...fav, film };
        })
      );

      return favoritesWithFilms;
    },
    enabled: !!user,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (filmId: string) => {
      if (!user) throw new Error('Must be logged in');

      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('film_id', filmId)
        .single();

      if (existing) {
        await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, film_id: filmId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useWatchHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['watch-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: history, error } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;

      // Get films for each history item
      const historyWithFilms = await Promise.all(
        (history || []).map(async (item) => {
          const { data: film } = await supabase
            .from('films')
            .select('*')
            .eq('id', item.film_id)
            .single();
          
          return { ...item, film };
        })
      );

      return historyWithFilms;
    },
    enabled: !!user,
  });
}

export function useAddToHistory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (filmId: string) => {
      if (!user) return;

      await supabase
        .from('watch_history')
        .insert({ user_id: user.id, film_id: filmId });

      // Increment view count
      try {
        await supabase.rpc('increment_view_count', { film_uuid: filmId });
      } catch {
        // Ignore errors
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watch-history'] });
    },
  });
}
