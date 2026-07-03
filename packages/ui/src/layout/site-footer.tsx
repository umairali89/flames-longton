import type { RestaurantTheme } from '@flames/theme';
import Link from 'next/link';

interface SiteFooterProps {
  theme: RestaurantTheme;
  hygieneWidget?: React.ReactNode;
}

export function SiteFooter({ theme, hygieneWidget }: SiteFooterProps) {
  const { business } = theme;
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-heading text-xl font-bold text-foreground">{theme.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{theme.tagline}</p>
          <p className="mt-4 text-sm text-muted-foreground">{business.address}</p>
          <p className="mt-1 text-sm text-primary">{business.phone}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Opening hours</p>
          <p className="mt-2 text-sm text-muted-foreground">{business.openingHours}</p>
          {business.deliveryAreas ? (
            <>
              <p className="mt-4 text-sm font-semibold text-foreground">Delivery areas</p>
              <p className="mt-2 text-sm text-muted-foreground">{business.deliveryAreas}</p>
            </>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Food hygiene rating</p>
          <div className="mt-3">{hygieneWidget}</div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Privacy policy
            </Link>
            <Link href="/allergens" className="text-muted-foreground hover:text-primary">
              Allergen info
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {theme.name}. All prices include applicable taxes where required.
      </div>
    </footer>
  );
}
