import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useFollowersCount(userId: string) {
  return useQuery({
    queryKey: ['followers-count', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
}

export function useFollowingCount(userId: string) {
  return useQuery({
    queryKey: ['following-count', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
}

export function useIsFollowing(targetUserId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['is-following', user?.id, targetUserId],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();
      return !!data;
    },
    enabled: !!user && !!targetUserId,
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Must be logged in');
      const { data: existing } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

      if (existing) {
        await supabase.from('followers').delete().eq('id', existing.id);
      } else {
        await supabase.from('followers').insert({ follower_id: user.id, following_id: targetUserId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers-count'] });
      queryClient.invalidateQueries({ queryKey: ['following-count'] });
      queryClient.invalidateQueries({ queryKey: ['is-following'] });
    },
  });
}
