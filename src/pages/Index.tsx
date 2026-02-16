import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, ArrowRight, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FilmCard } from '@/components/films/FilmCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useFeaturedFilms, useFilms, useFilmRatings } from '@/hooks/useFilms';
import { useAuth } from '@/hooks/useAuth';
import heroBanner from '@/assets/hero-banner.jpg';

const Index = () => {
  const { user } = useAuth();
  const { data: popularFilms, isLoading: loadingPopular } = useFilms({ sortBy: 'popular' });
  const { data: recentFilms, isLoading: loadingRecent } = useFilms({ sortBy: 'newest' });
  const { data: featuredFilms } = useFeaturedFilms();

  return (
    <Layout>
      {/* Compact Hero */}
      <section className="relative h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Cinema" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        <div className="container relative z-10 px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">
              Bienvenue sur <span className="text-gradient-gold">Instant</span>
            </h1>
            <p className="text-muted-foreground max-w-lg text-sm md:text-base">
              Découvrez et partagez les meilleurs courts métrages libres de droits.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Popular Films */}
      <section className="py-8">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Populaires</h2>
            </div>
            <Link to="/search?sortBy=popular">
              <Button variant="ghost" size="sm" className="text-primary text-sm">
                Voir tout <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loadingPopular ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-36 flex-shrink-0 aspect-[2/3] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {popularFilms?.slice(0, 8).map((film) => (
                <div key={film.id} className="w-36 md:w-44 flex-shrink-0">
                  <FilmCard film={film} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recommended / Featured */}
      <section className="py-8 bg-card/30">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold">Recommandés pour vous</h2>
            </div>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="text-primary text-sm">
                Voir tout <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loadingRecent ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(featuredFilms || recentFilms)?.slice(0, 4).map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Reviews */}
      <section className="py-8">
        <div className="container px-4">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Top Reviews</h2>
          </div>

          <TopReviews />
        </div>
      </section>

      {/* CTA if not logged in */}
      {!user && (
        <section className="py-8">
          <div className="container px-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent border border-border p-6 text-center">
              <h2 className="text-xl font-bold mb-2">Rejoignez Instant</h2>
              <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
                Créez votre compte et commencez à découvrir des courts métrages exceptionnels.
              </p>
              <Link to="/auth">
                <Button className="btn-cinema">
                  <span>Créer un compte</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

function TopReviews() {
  // We'll show recent film ratings as "top reviews"
  const { data: films } = useFilms({ sortBy: 'popular' });
  const firstFilmId = films?.[0]?.id;
  const { data: ratings } = useFilmRatings(firstFilmId || '');

  // Show placeholder reviews if no data
  const displayReviews = ratings?.slice(0, 3);

  if (!displayReviews || displayReviews.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="cinema-card p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
        <p className="text-center text-muted-foreground text-sm py-2">
          Aucune review pour le moment. Soyez le premier à noter un film !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayReviews.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="cinema-card p-4"
        >
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {review.profile?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">
                  {review.profile?.username || 'Utilisateur'}
                </span>
                <div className="flex items-center gap-1 text-primary">
                  <Star className="w-3 h-3 fill-primary" />
                  <span className="text-xs font-medium">{review.rating}/10</span>
                </div>
              </div>
              {review.review && (
                <p className="text-sm text-muted-foreground line-clamp-2">{review.review}</p>
              )}
              <Link
                to={`/films/${review.film_id}`}
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                Voir le film →
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Index;
