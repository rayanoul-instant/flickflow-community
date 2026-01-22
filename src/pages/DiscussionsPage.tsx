import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Heart, Clock, Film } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDiscussions, useCreateDiscussion, useLikeDiscussion } from '@/hooks/useDiscussions';
import { useFilms } from '@/hooks/useFilms';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DiscussionsPage() {
  const [searchParams] = useSearchParams();
  const filmIdParam = searchParams.get('filmId');
  
  const { user } = useAuth();
  const { data: discussions, isLoading } = useDiscussions(filmIdParam || undefined);
  const { data: films } = useFilms();
  const createDiscussion = useCreateDiscussion();
  const likeDiscussion = useLikeDiscussion();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedFilmId, setSelectedFilmId] = useState<string>('');

  const handleCreateDiscussion = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await createDiscussion.mutateAsync({
        title: newTitle,
        content: newContent,
        filmId: selectedFilmId || undefined,
      });
      toast.success('Discussion créée avec succès');
      setIsDialogOpen(false);
      setNewTitle('');
      setNewContent('');
      setSelectedFilmId('');
    } catch {
      toast.error('Erreur lors de la création');
    }
  };

  const handleLike = (discussionId: string) => {
    if (!user) {
      toast.error('Connectez-vous pour aimer cette discussion');
      return;
    }
    likeDiscussion.mutate(discussionId);
  };

  return (
    <Layout>
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Discussions
            </h1>
            <p className="text-muted-foreground">
              Partagez vos avis et discutez avec la communauté
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-cinema" disabled={!user}>
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvelle discussion
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Créer une discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Titre</label>
                  <Input
                    placeholder="Titre de votre discussion"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Film associé (optionnel)
                  </label>
                  <Select value={selectedFilmId} onValueChange={setSelectedFilmId}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Sélectionner un film" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun film</SelectItem>
                      {films?.map((film) => (
                        <SelectItem key={film.id} value={film.id}>
                          {film.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                  <Textarea
                    placeholder="Votre message..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="bg-secondary border-border min-h-[120px]"
                  />
                </div>
                <Button 
                  onClick={handleCreateDiscussion} 
                  className="btn-cinema w-full"
                  disabled={createDiscussion.isPending}
                >
                  <span>Publier</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!user && (
          <div className="bg-card/50 border border-border rounded-xl p-4 mb-6 text-center">
            <p className="text-muted-foreground">
              <Link to="/auth" className="text-primary hover:underline">Connectez-vous</Link>
              {' '}pour participer aux discussions
            </p>
          </div>
        )}

        {/* Discussions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : discussions && discussions.length > 0 ? (
          <div className="space-y-4">
            {discussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/discussions/${discussion.id}`}
                  className="block cinema-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {discussion.profile?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display font-semibold text-lg line-clamp-1">
                          {discussion.title}
                        </h3>
                        {discussion.film && (
                          <Badge variant="outline" className="flex-shrink-0 border-border">
                            <Film className="w-3 h-3 mr-1" />
                            {discussion.film.title}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {discussion.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(discussion.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                        <span className="text-primary">
                          @{discussion.profile?.username || 'utilisateur'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(discussion.id);
                          }}
                          className="flex items-center gap-1 hover:text-accent transition-colors"
                        >
                          <Heart className="w-3 h-3" />
                          {discussion.likes_count}
                        </button>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {discussion.comments_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Aucune discussion pour le moment</p>
            {user && (
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                variant="outline" 
                className="mt-4 border-border"
              >
                Créer la première discussion
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
