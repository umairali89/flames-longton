import Image from 'next/image';
import type { RestaurantTheme } from '@flames/theme';
import { getCategoryIcon } from '@flames/theme';
import { cn } from '../lib/cn';

interface FoodImageProps {
  src?: string | null;
  alt: string;
  theme?: RestaurantTheme;
  categorySlug?: string;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  priority?: boolean;
  fallbackSize?: 'sm' | 'md' | 'lg';
}

const fallbackTextSize = {
  sm: 'text-4xl',
  md: 'text-5xl',
  lg: 'text-8xl',
} as const;

export function FoodImage({
  src,
  alt,
  theme,
  categorySlug = '',
  className,
  containerClassName,
  sizes = '(max-width: 768px) 50vw, 33vw',
  priority = false,
  fallbackSize = 'sm',
}: FoodImageProps) {
  const icon = theme ? getCategoryIcon(theme, categorySlug) : '🍽️';

  if (src) {
    return (
      <div className={cn('relative h-full w-full overflow-hidden', containerClassName)}>
        <Image
          src={src}
          alt={alt}
          fill
          className={cn('object-cover transition-transform duration-500 group-hover:scale-105', className)}
          sizes={sizes}
          priority={priority}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-muted/80 via-surface-elevated to-background',
        containerClassName,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,var(--color-primary)_0%,transparent_60%)] opacity-10" />
      <span className={cn('relative', fallbackTextSize[fallbackSize])} aria-hidden>
        {icon}
      </span>
    </div>
  );
}
