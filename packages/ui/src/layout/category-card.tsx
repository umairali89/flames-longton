import Link from 'next/link';
import type { RestaurantTheme } from '@flames/theme';
import { cn } from '../lib/cn';
import { Badge } from '../badge';
import { FoodImage } from '../menu/food-image';

interface CategoryCardProps {
  theme: RestaurantTheme;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
  className?: string;
}

export function CategoryCard({
  theme,
  slug,
  name,
  description,
  imageUrl,
  productCount,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={`/menu?category=${slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface no-underline',
        'transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated',
        className,
      )}
    >
      <div className="relative h-36 overflow-hidden">
        <FoodImage
          src={imageUrl}
          alt={name}
          theme={theme}
          categorySlug={slug}
          fallbackSize="md"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>
        {description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {productCount !== undefined ? (
          <Badge variant="outline" className="mt-3 w-fit">
            {productCount} items
          </Badge>
        ) : null}
      </div>
    </Link>
  );
}
