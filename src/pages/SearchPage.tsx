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
import { FilmGenre, GENRE_LABELS } from '@/types/database';

const GENRES: FilmGenre[] = [
  'drama', 'comedy', 'documentary', 'animation',
  'thriller', 'horror', 'romance', 'scifi', 'experimental', 'fantasy'
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialSort = (searchParams.get('sortBy') as 'newest' | 'popular' | 'rating') || 'newest';
  const initialGenre = searchParams.get('genre') as FilmGenre | null;

  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>(initialSort);
  const [selectedGenre, setSelectedGenre] = useState<FilmGenre | null>(initialGenre);

  const { data: films, isLoading } = useFilms({ search, sortBy, genre: selectedGenre || undefined });

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set('search', value);
    else params.delete('search');
    setSearchParams(params);
  };

  const handleGenreChange = (genre: FilmGenre | null) => {
    setSelectedGenre(genre);
    const params = new URLSearchParams(searchParams);
    if (genre) params.set('genre', genre);
    else params.delete('genre');
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="container px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un film, réalisateur..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-secondary border-border h-12 text-base rounded-xl"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-4">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[160px] bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="popular">Plus populaires</SelectItem>
              <SelectItem value="rating">Mieux notés</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{films?.length || 0} résultats</span>
        </div>

        {/* Genres as horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          <button
            onClick={() => handleGenreChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedGenre === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Tous
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedGenre === genre
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {GENRE_LABELS[genre]}
            </button>
          ))}
        </div>

        {/* Results */}
        <FilmGrid films={films || []} loading={isLoading} />
      </div>
    </Layout>
  );
}
