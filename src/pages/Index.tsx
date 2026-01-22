import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Film as FilmIcon, MessageSquare, Users, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FilmCard } from '@/components/films/FilmCard';
import { Button } from '@/components/ui/button';
import { useFeaturedFilms, useFilms } from '@/hooks/useFilms';
import heroBanner from '@/assets/hero-banner.jpg';

const Index = () => {
  const { data: featuredFilms, isLoading: loadingFeatured } = useFeaturedFilms();
  const { data: recentFilms, isLoading: loadingRecent } = useFilms({ sortBy: 'newest' });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroBanner} 
            alt="Cinema background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        {/* Content */}
        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-foreground">Découvrez le</span>{' '}
              <span className="text-gradient-gold">Cinéma Court</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explorez des centaines de courts métrages libres de droits. 
              Rejoignez une communauté passionnée par l'art du format court.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/films">
                <Button size="lg" className="btn-cinema group">
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5 fill-primary-foreground" />
                    Explorer les films
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link to="/discussions">
                <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Rejoindre les discussions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FilmIcon, value: '500+', label: 'Courts Métrages' },
              { icon: Users, value: '10K+', label: 'Membres Actifs' },
              { icon: MessageSquare, value: '50K+', label: 'Discussions' },
              { icon: Play, value: '1M+', label: 'Visionnages' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Films */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                À la Une
              </h2>
              <p className="text-muted-foreground">
                Sélection de nos meilleurs courts métrages
              </p>
            </div>
            <Link to="/films?sortBy=popular">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Voir tout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredFilms?.slice(0, 4).map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Films */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Nouveautés
              </h2>
              <p className="text-muted-foreground">
                Les derniers films ajoutés à notre catalogue
              </p>
            </div>
            <Link to="/films?sortBy=newest">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Voir tout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loadingRecent ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {recentFilms?.slice(0, 5).map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-transparent border border-border p-8 md:p-12 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(38_90%_55%/0.1),transparent_50%)]" />
            
            <div className="relative z-10">
              <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">
                Prêt à rejoindre la communauté ?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Créez votre compte gratuit et commencez à découvrir des courts métrages exceptionnels. 
                Partagez vos avis et connectez-vous avec d'autres passionnés.
              </p>
              <Link to="/auth">
                <Button size="lg" className="btn-cinema">
                  <span>Créer un compte gratuitement</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
