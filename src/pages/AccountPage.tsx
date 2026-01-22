import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Star, Clock, Heart, Edit2, Save, Film, BarChart3 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FilmCard } from '@/components/films/FilmCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites, useWatchHistory } from '@/hooks/useFilms';
import { AVATAR_BASES } from '@/types/database';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AccountPage() {
  const { user, profile, loading, updateProfile } = useAuth();
  const { data: favorites, isLoading: loadingFavorites } = useFavorites();
  const { data: history, isLoading: loadingHistory } = useWatchHistory();

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(profile?.username || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_base || 'default');

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSaveProfile = async () => {
    if (!editUsername.trim()) {
      toast.error('Le pseudo ne peut pas être vide');
      return;
    }

    const { error } = await updateProfile({
      username: editUsername,
      bio: editBio,
      avatar_base: selectedAvatar,
    });

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success('Profil mis à jour');
      setIsEditing(false);
    }
  };

  const stats = {
    filmsWatched: history?.length || 0,
    favorites: favorites?.length || 0,
    avgRating: 7.5, // Placeholder
  };

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
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarFallback className="bg-gradient-gold text-3xl md:text-4xl text-primary-foreground font-display">
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Pseudo</label>
                    <Input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="bg-secondary border-border max-w-xs"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Bio</label>
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="bg-secondary border-border"
                      placeholder="Parlez-nous de vous..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Avatar</label>
                    <div className="flex gap-2">
                      {AVATAR_BASES.map((avatar) => (
                        <button
                          key={avatar}
                          onClick={() => setSelectedAvatar(avatar)}
                          className={cn(
                            "w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center bg-secondary",
                            selectedAvatar === avatar 
                              ? "border-primary" 
                              : "border-border hover:border-muted-foreground"
                          )}
                        >
                          <span className="text-lg">
                            {avatar === 'default' ? '👤' : 
                             avatar === 'cat' ? '🐱' :
                             avatar === 'dog' ? '🐶' :
                             avatar === 'robot' ? '🤖' :
                             avatar === 'alien' ? '👽' : '👻'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="btn-cinema">
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="border-border"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                        {profile?.username || 'Utilisateur'}
                      </h1>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditUsername(profile?.username || '');
                        setEditBio(profile?.bio || '');
                        setSelectedAvatar(profile?.avatar_base || 'default');
                        setIsEditing(true);
                      }}
                      className="border-border"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                  
                  {profile?.bio && (
                    <p className="text-muted-foreground mb-4">{profile.bio}</p>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{stats.filmsWatched}</span>
                      <span className="text-muted-foreground">films vus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-accent" />
                      <span className="font-semibold">{stats.favorites}</span>
                      <span className="text-muted-foreground">favoris</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary fill-primary" />
                      <span className="font-semibold">{stats.avgRating}</span>
                      <span className="text-muted-foreground">note moyenne</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Heart className="w-4 h-4 mr-2" />
              Favoris
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            <h2 className="font-display text-xl font-semibold mb-4">Mes films favoris</h2>
            {loadingFavorites ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
                ))}
              </div>
            ) : favorites && favorites.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favorites.map((fav) => fav.film && (
                  <FilmCard key={fav.id} film={fav.film} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun film favori pour le moment</p>
                <Link to="/films">
                  <Button variant="outline" className="mt-4 border-border">
                    Découvrir des films
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <h2 className="font-display text-xl font-semibold mb-4">Historique de visionnage</h2>
            {loadingHistory ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => item.film && (
                  <Link 
                    key={item.id} 
                    to={`/films/${item.film.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-secondary transition-colors"
                  >
                    <div className="w-16 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      {item.film.thumbnail_url ? (
                        <img 
                          src={item.film.thumbnail_url} 
                          alt={item.film.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Film className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-1">{item.film.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.film.director}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(item.watched_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun film visionné récemment</p>
                <Link to="/films">
                  <Button variant="outline" className="mt-4 border-border">
                    Regarder un film
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <h2 className="font-display text-xl font-semibold mb-4">Mes statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="cinema-card p-6 text-center">
                <Film className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-gradient-gold mb-1">
                  {stats.filmsWatched}
                </p>
                <p className="text-muted-foreground">Films visionnés</p>
              </div>
              <div className="cinema-card p-6 text-center">
                <Heart className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-gradient-gold mb-1">
                  {stats.favorites}
                </p>
                <p className="text-muted-foreground">Films favoris</p>
              </div>
              <div className="cinema-card p-6 text-center">
                <Star className="w-8 h-8 text-primary fill-primary mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-gradient-gold mb-1">
                  {stats.avgRating}/10
                </p>
                <p className="text-muted-foreground">Note moyenne donnée</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
