import type { RestaurantTheme } from '@flames/theme';
import { cn } from '../lib/cn';
import { FoodImage } from '../menu/food-image';

interface ProductHeroProps {
  theme: RestaurantTheme;
  name: string;
  imageUrl?: string | null;
  categorySlug?: string;
  className?: string;
}

export function ProductHero({ theme, name, imageUrl, categorySlug, className }: ProductHeroProps) {
  return (
    <div
      className={cn(
        'group relative aspect-square overflow-hidden rounded-2xl border border-border',
        className,
      )}
    >
      <FoodImage
        src={imageUrl}
        alt={name}
        theme={theme}
        categorySlug={categorySlug ?? ''}
        fallbackSize="lg"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}
