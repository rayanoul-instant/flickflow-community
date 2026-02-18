import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FilmGrid } from '@/components/films/FilmGrid';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useFilms } from '@/hooks/useFilms';
import { FilmGenre, GENRE_LABELS } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

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
  const [userResults, setUserResults] = useState<{ id: string; username: string }[]>([]);

  const { data: films, isLoading } = useFilms({ search, sortBy, genre: selectedGenre || undefined });

  const handleSearch = async (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set('search', value);
    else params.delete('search');
    setSearchParams(params);

    // Search users
    if (value.length >= 2) {
      const { data } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', `%${value}%`)
        .limit(5);
      setUserResults(data || []);
    } else {
      setUserResults([]);
    }
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
            placeholder="Search films, directors, users..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-secondary border-border h-12 text-base rounded-xl"
          />

          {/* User search results dropdown */}
          {userResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-1 z-10 shadow-lg">
              <p className="px-4 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">Users</p>
              {userResults.map((u) => (
                <Link
                  key={u.id}
                  to={`/user/${u.id}`}
                  onClick={() => setUserResults([])}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {u.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{u.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-4">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[160px] bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{films?.length || 0} results</span>
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
            All
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
