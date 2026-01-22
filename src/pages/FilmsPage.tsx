import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FilmGrid } from '@/components/films/FilmGrid';
import { GenreFilter } from '@/components/films/GenreFilter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilms } from '@/hooks/useFilms';
import { FilmGenre } from '@/types/database';

export default function FilmsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const initialSearch = searchParams.get('search') || '';
  const initialSort = (searchParams.get('sortBy') as 'newest' | 'popular' | 'rating') || 'newest';
  const initialGenre = searchParams.get('genre') as FilmGenre | null;
  
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>(initialSort);
  const [genre, setGenre] = useState<FilmGenre | null>(initialGenre);

  const { data: films, isLoading } = useFilms({ search, sortBy, genre: genre || undefined });

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleSortChange = (value: 'newest' | 'popular' | 'rating') => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', value);
    setSearchParams(params);
  };

  const handleGenreChange = (value: FilmGenre | null) => {
    setGenre(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('genre', value);
    } else {
      params.delete('genre');
    }
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="container px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Catalogue Films
          </h1>
          <p className="text-muted-foreground">
            Découvrez notre sélection de courts métrages libres de droits
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher un film, réalisateur..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="popular">Plus populaires</SelectItem>
                  <SelectItem value="rating">Mieux notés</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-primary text-primary-foreground' : 'border-border'}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Genre Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4"
            >
              <GenreFilter selectedGenre={genre} onGenreChange={handleGenreChange} />
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {films?.length || 0} films trouvés
        </p>

        {/* Films Grid */}
        <FilmGrid films={films || []} loading={isLoading} />
      </div>
    </Layout>
  );
}
