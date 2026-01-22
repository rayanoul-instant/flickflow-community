import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 10, 
  size = 'md',
  interactive = false,
  onRatingChange 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const stars = maxRating / 2; // Show 5 stars for rating out of 10
  const displayRating = hoverRating || rating;
  const starRating = displayRating / 2; // Convert to 5-star scale

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = (index + 1) * 2; // Convert back to 10-point scale
        const isFilled = index < Math.floor(starRating);
        const isHalfFilled = !isFilled && index < starRating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            className={cn(
              "relative transition-transform",
              interactive && "cursor-pointer hover:scale-110"
            )}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRatingChange?.(starValue)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isFilled || isHalfFilled
                  ? "text-primary fill-primary"
                  : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
      <span className={cn(
        "ml-2 font-medium text-foreground",
        size === 'sm' && 'text-sm',
        size === 'lg' && 'text-xl'
      )}>
        {rating > 0 ? rating.toFixed(1) : 'N/A'}
      </span>
    </div>
  );
}
