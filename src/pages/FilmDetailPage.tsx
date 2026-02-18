import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User, Star, Heart, Share2, MessageSquare } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoPlayer } from '@/components/films/VideoPlayer';
import { StarRating } from '@/components/films/StarRating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useFilm, useFilmRatings, useRateFilm, useToggleFavorite, useFavorites, useAddToHistory } from '@/hooks/useFilms';
import { useAuth } from '@/hooks/useAuth';
import { GENRE_LABELS } from '@/types/database';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: film, isLoading } = useFilm(id!);
  const { data: ratings } = useFilmRatings(id!);
  const { data: favorites } = useFavorites();
  const rateFilm = useRateFilm();
  const toggleFavorite = useToggleFavorite();
  const addToHistory = useAddToHistory();

  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isFavorited = favorites?.some((f) => f.film_id === id);

  const handleRate = async () => {
    if (!user) {
      toast.error('Sign in to rate this film');
      return;
    }
    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      await rateFilm.mutateAsync({ filmId: id!, rating: userRating, review: review || undefined });
      toast.success('Your rating has been saved');
      setShowReviewForm(false);
      setReview('');
    } catch {
      toast.error('Failed to save rating');
    }
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error('Sign in to add to favorites');
      return;
    }
    toggleFavorite.mutate(id!);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handlePlay = () => {
    if (user) {
      addToHistory.mutate(id!);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="aspect-video rounded-xl mb-8" />
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Layout>
    );
  }

  if (!film) {
    return (
      <Layout>
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Film not found</h1>
          <Link to="/search">
            <Button>Back to catalog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8">
        <Link to="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to catalog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <VideoPlayer 
            src={film.video_url} 
            poster={film.thumbnail_url || undefined}
            onPlay={handlePlay}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  {film.title}
                </h1>
                {film.director && (
                  <p className="text-lg text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {film.director}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavorite}
                  className={cn(
                    "border-border",
                    isFavorited && "bg-accent/20 text-accent border-accent"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isFavorited && "fill-accent")} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare} className="border-border">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Link to={`/discussions?filmId=${id}`}>
                  <Button variant="outline" size="icon" className="border-border">
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {film.duration_minutes} min
              </div>
              {film.release_year && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {film.release_year}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-medium">{film.average_rating?.toFixed(1) || 'N/A'}</span>
                <span className="text-muted-foreground">({ratings?.length || 0} reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {film.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="bg-secondary text-secondary-foreground">
                  {GENRE_LABELS[genre]}
                </Badge>
              ))}
            </div>

            {film.synopsis && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-3">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed">{film.synopsis}</p>
              </div>
            )}

            {film.themes.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-3">Themes</h2>
                <div className="flex flex-wrap gap-2">
                  {film.themes.map((theme) => (
                    <Badge key={theme} variant="outline" className="border-border capitalize">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="cinema-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4">Rate this film</h3>
              
              {user ? (
                <>
                  <StarRating
                    rating={userRating}
                    size="lg"
                    interactive
                    onRatingChange={setUserRating}
                  />
                  
                  {userRating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-3"
                    >
                      {showReviewForm ? (
                        <>
                          <Textarea
                            placeholder="Your review (optional)"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="bg-secondary border-border"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleRate} className="btn-cinema flex-1">
                              <span>Submit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowReviewForm(false)}
                              className="border-border"
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={handleRate} className="btn-cinema flex-1">
                            <span>Rate</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowReviewForm(true)}
                            className="border-border"
                          >
                            + Review
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  <Link to="/auth" className="text-primary hover:underline">
                    Sign in
                  </Link>
                  {' '}to rate this film
                </p>
              )}
            </div>

            <div className="cinema-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4">
                Recent reviews ({ratings?.length || 0})
              </h3>
              
              {ratings && ratings.length > 0 ? (
                <div className="space-y-4">
                  {ratings.slice(0, 5).map((rating) => (
                    <div key={rating.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {rating.profile?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">
                            {rating.profile?.username || 'User'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <Star className="w-3 h-3 fill-primary" />
                          <span className="text-sm font-medium">{rating.rating}</span>
                        </div>
                      </div>
                      {rating.review && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {rating.review}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No reviews yet. Be the first!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
