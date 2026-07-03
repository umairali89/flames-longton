import Link from 'next/link';
import type { RestaurantTheme } from '@flames/theme';
import { Badge } from '../badge';
import { ButtonLink } from '../button-link';
import { buttonStyles } from '../button';
import { FoodImage } from './food-image';
import { cn } from '../lib/cn';

export interface ProductCardData {
  slug: string;
  name: string;
  description?: string | null;
  displayPrice: string;
  imageUrl?: string | null;
  dietaryTags?: string[];
  allergens?: string[];
  calories?: number | null;
  isAvailable?: boolean;
  category?: { slug: string };
}

interface ProductCardProps {
  product: ProductCardData;
  theme?: RestaurantTheme;
}

export function ProductCard({ product, theme }: ProductCardProps) {
  const unavailable = product.isAvailable === false;
  const categorySlug = product.category?.slug ?? '';

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface',
        'transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card',
        unavailable && 'opacity-75',
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block h-40 overflow-hidden no-underline"
        aria-label={`View ${product.name}`}
      >
        <FoodImage
          src={product.imageUrl}
          alt={product.name}
          theme={theme}
          categorySlug={categorySlug}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {unavailable ? (
          <Badge variant="warning" className="absolute right-3 top-3 z-10">
            Sold out
          </Badge>
        ) : null}
        {product.allergens && product.allergens.length > 0 ? (
          <span className="absolute bottom-2 left-2 z-10 rounded-md bg-background/80 px-2 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
            {product.allergens.length} allergen{product.allergens.length > 1 ? 's' : ''}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {product.dietaryTags?.map((tag) => (
            <Badge key={tag} variant="dietary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/product/${product.slug}`} className="no-underline">
          <h3 className="font-heading text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        {product.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-lg font-bold text-primary">{product.displayPrice}</p>
            {product.calories ? (
              <p className="text-xs text-muted-foreground">{product.calories} kcal</p>
            ) : null}
          </div>
          {unavailable ? (
            <span className={buttonStyles({ size: 'sm', className: 'opacity-50 cursor-not-allowed' })}>
              Unavailable
            </span>
          ) : (
            <ButtonLink href={`/product/${product.slug}`} size="sm">
              Choose
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}
