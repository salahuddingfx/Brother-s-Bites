'use client';

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // 0 - 5 (supports decimals like 4.5, 3.5)
  maxStars?: number;
  size?: number;
  showScore?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  showScore = false,
  className = '',
}: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starValue = idx + 1;
          const isFull = roundedRating >= starValue;
          const isHalf = !isFull && roundedRating >= starValue - 0.5;

          if (isFull) {
            return (
              <Star
                key={idx}
                size={size}
                className="text-brand-yellow fill-brand-yellow shrink-0"
              />
            );
          }

          if (isHalf) {
            return (
              <div key={idx} className="relative inline-block shrink-0" style={{ width: size, height: size }}>
                <Star size={size} className="text-brand-cream/20 absolute inset-0" />
                <div className="overflow-hidden absolute inset-0 w-1/2">
                  <Star size={size} className="text-brand-yellow fill-brand-yellow" />
                </div>
              </div>
            );
          }

          return (
            <Star
              key={idx}
              size={size}
              className="text-brand-cream/20 shrink-0"
            />
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-bold text-brand-yellow ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
