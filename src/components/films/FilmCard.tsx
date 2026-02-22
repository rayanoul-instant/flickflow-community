import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star, Play, Heart } from 'lucide-react';
import { Film, GENRE_LABELS } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToggleFavorite, useFavorites } from '@/hooks/useFilms';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface FilmCardProps {
  film: Film;
  featured?: boolean;
  isTop3?: boolean;
}

export function FilmCard({ film, featured = false, isTop3 = false }: FilmCardProps) {
  const { user } = useAuth();
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  
  const isFavorited = favorites?.some((f) => f.film_id === film.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleFavorite.mutate(film.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "cinema-card group",
        featured ? "col-span-2 row-span-2" : ""
      )}
    >
      <Link to={`/films/${film.id}`} className="block">
        {/* Thumbnail */}
        <div className={cn(
          "relative overflow-hidden bg-secondary",
          "aspect-[16/9]"
        )}>
          {film.thumbnail_url ? (
            <img
              src={film.thumbnail_url}
              alt={film.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <Play className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="film-overlay flex flex-col justify-end p-4">
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
              </motion.div>
            </div>
          </div>

          {/* Favorite / Like Button */}
          {user && !isTop3 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className={cn(
                "absolute top-2 right-2 z-10 bg-black/50 backdrop-blur-sm",
                isFavorited ? "text-accent" : "text-foreground/80 hover:text-accent"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorited && "fill-accent")} />
            </Button>
          )}

          {/* Top 3 overlapping hearts */}
          {isTop3 && (
            <div className="absolute top-2 right-2 z-10 flex -space-x-1.5">
              <Heart className="w-4 h-4 text-accent fill-accent drop-shadow-md" />
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 drop-shadow-md" />
              <Heart className="w-4 h-4 text-red-400 fill-red-400 drop-shadow-md" />
            </div>
          )}

          {/* Duration Badge */}
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-foreground border-0"
          >
            <Clock className="w-3 h-3 mr-1" />
            {film.duration_minutes} min
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className={cn(
            "font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1",
            featured ? "text-xl" : "text-base"
          )}>
            {film.title}
          </h3>
          
          {film.director && (
            <p className="text-sm text-muted-foreground mt-1">
              {film.director}
            </p>
          )}

          {/* Rating & Genres */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-primary">
              <Star className="w-4 h-4 fill-primary" />
              <span className="text-sm font-medium">
                {film.average_rating ? film.average_rating.toFixed(1) : 'N/A'}
              </span>
            </div>
            
            <div className="flex gap-1">
              {film.genres.slice(0, 2).map((genre) => (
                <Badge 
                  key={genre} 
                  variant="outline" 
                  className="text-xs border-border text-muted-foreground"
                >
                  {GENRE_LABELS[genre]}
                </Badge>
              ))}
            </div>
          </div>

          {featured && film.synopsis && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {film.synopsis}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
