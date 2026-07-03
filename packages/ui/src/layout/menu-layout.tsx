import Link from 'next/link';
import type { RestaurantTheme } from '@flames/theme';
import { getCategoryIcon } from '@flames/theme';
import { cn } from '../lib/cn';
import { PageHeader } from './page-header';
import { FilterChips, type FilterChip } from './filter-chips';

interface MenuCategory {
  id: string;
  slug: string;
  name: string;
}

interface MenuLayoutProps {
  theme: RestaurantTheme;
  categories: MenuCategory[];
  activeCategory?: string;
  activeDietary?: string;
  dietaryFilters: readonly string[];
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  hasProducts: boolean;
}

export function MenuLayout({
  theme,
  categories,
  activeCategory,
  activeDietary,
  dietaryFilters,
  children,
  emptyState,
  hasProducts,
}: MenuLayoutProps) {
  const categoryChips: FilterChip[] = [
    { id: 'all', label: 'All', href: '/menu', active: !activeCategory && !activeDietary },
    ...categories.map((cat) => ({
      id: cat.slug,
      label: cat.name,
      href: `/menu?category=${cat.slug}${activeDietary ? `&dietary=${activeDietary}` : ''}`,
      active: activeCategory === cat.slug,
    })),
  ];

  const dietaryChips: FilterChip[] = dietaryFilters.map((d) => ({
    id: d,
    label: d.charAt(0).toUpperCase() + d.slice(1),
    href: `/menu?dietary=${d}${activeCategory ? `&category=${activeCategory}` : ''}`,
    active: activeDietary === d,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Menu"
        description="Tap any item for allergens, customisation options and nutritional info."
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav aria-label="Categories" className="sticky top-24 space-y-1">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            <Link
              href="/menu"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors',
                !activeCategory
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span aria-hidden>🍽️</span>
              All items
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu?category=${cat.slug}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors',
                  activeCategory === cat.slug
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span aria-hidden>{getCategoryIcon(theme, cat.slug)}</span>
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 space-y-4 lg:hidden">
            <FilterChips chips={categoryChips} />
          </div>
          <FilterChips label="Dietary" chips={dietaryChips} className="mb-8" />
          {hasProducts ? children : emptyState}
        </div>
      </div>
    </div>
  );
}
