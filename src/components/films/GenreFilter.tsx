import { FilmGenre, GENRE_LABELS } from '@/types/database';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GenreFilterProps {
  selectedGenre: FilmGenre | null;
  onGenreChange: (genre: FilmGenre | null) => void;
}

const GENRES: FilmGenre[] = [
  'drama', 'comedy', 'documentary', 'animation', 
  'thriller', 'horror', 'romance', 'scifi', 'experimental', 'fantasy'
];

export function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedGenre === null ? "default" : "outline"}
        size="sm"
        onClick={() => onGenreChange(null)}
        className={cn(
          "rounded-full",
          selectedGenre === null 
            ? "btn-cinema" 
            : "border-border hover:bg-secondary"
        )}
      >
        <span>Tous</span>
      </Button>
      
      {GENRES.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenre === genre ? "default" : "outline"}
          size="sm"
          onClick={() => onGenreChange(genre)}
          className={cn(
            "rounded-full",
            selectedGenre === genre 
              ? "btn-cinema" 
              : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{GENRE_LABELS[genre]}</span>
        </Button>
      ))}
    </div>
  );
}
