import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Film, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FilmCard } from '@/components/films/FilmCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFollowersCount, useFollowingCount, useIsFollowing, useToggleFollow } from '@/hooks/useFollowers';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: followersCount = 0 } = useFollowersCount(id!);
  const { data: followingCount = 0 } = useFollowingCount(id!);
  const { data: isFollowing = false } = useIsFollowing(id!);
  const toggleFollowMutation = useToggleFollow();

  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    const [profileRes, ratingsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id!).single(),
      supabase
        .from('film_ratings')
        .select('*, film:films(id, title, thumbnail_url, director)')
        .eq('user_id', id!)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    setProfile(profileRes.data);
    setRatings(ratingsRes.data || []);

    // Load favorites - we query film_ids from favorites then fetch films
    const { data: favData } = await supabase
      .from('favorites')
      .select('*, film:films(*)')
      .eq('user_id', id!)
      .order('created_at', { ascending: false })
      .limit(20);
    setFavorites(favData || []);

    setLoading(false);
  };

  const handleFollow = () => {
    if (!user) {
      toast.error('Sign in to follow users');
      return;
    }
    toggleFollowMutation.mutate(id!);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="flex gap-6 mb-8">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <Link to="/search">
            <Button>Back to search</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const topFavorites = favorites.slice(0, 3);

  return (
    <Layout>
      <div className="container px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cinema-card p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarFallback className="bg-gradient-gold text-3xl md:text-4xl text-primary-foreground font-display">
                {profile.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                    {profile.username}
                  </h1>
                  {profile.bio && (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
                {user && user.id !== id && (
                  <Button
                    variant={isFollowing ? 'outline' : 'default'}
                    size="sm"
                    onClick={handleFollow}
                    className={isFollowing ? 'border-border' : 'btn-cinema'}
                  >
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{followersCount}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{followingCount}</span>
                  <span className="text-muted-foreground">following</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent" />
                  <span className="font-semibold">{favorites.length}</span>
                  <span className="text-muted-foreground">favorites</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top 3 Favorites */}
        {topFavorites.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-semibold mb-4">Top 3 Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topFavorites.map((fav) => fav.film && (
                <FilmCard key={fav.id} film={fav.film} />
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            {ratings.length > 0 ? (
              <div className="space-y-3">
                {ratings.map((r) => (
                  <Link
                    key={r.id}
                    to={`/films/${r.film_id}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card hover:bg-secondary transition-colors"
                  >
                    <div className="w-16 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {r.film?.thumbnail_url ? (
                        <img src={r.film.thumbnail_url} alt={r.film.title} className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm line-clamp-1">{r.film?.title}</h3>
                        <div className="flex items-center gap-1 text-primary">
                          <Star className="w-3 h-3 fill-primary" />
                          <span className="text-xs font-medium">{r.rating}/10</span>
                        </div>
                      </div>
                      {r.review && <p className="text-sm text-muted-foreground line-clamp-2">{r.review}</p>}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No reviews yet.</p>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favorites.map((fav) => fav.film && (
                  <FilmCard key={fav.id} film={fav.film} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No favorites yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
