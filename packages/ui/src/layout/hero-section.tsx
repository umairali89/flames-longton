import Image from 'next/image';
import type { RestaurantTheme } from '@flames/theme';
import { ButtonLink } from '../button-link';
import { Badge } from '../badge';

interface HeroSectionProps {
  theme: RestaurantTheme;
}

export function HeroSection({ theme }: HeroSectionProps) {
  const { marketing } = theme;
  const heroImages = marketing.heroImages ?? [];

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_50%)] opacity-20" />
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl animate-slide-up">
            <div className="mb-4 flex flex-wrap gap-2">
              {marketing.trustBadges.map((badge) => (
                <Badge key={badge} variant="primary">
                  {badge}
                </Badge>
              ))}
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              {theme.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">{theme.tagline}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {marketing.cuisineTags.join(' · ')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/menu" size="lg">
                Browse menu
              </ButtonLink>
              <ButtonLink href="/menu?dietary=halal" variant="outline" size="lg">
                Halal options
              </ButtonLink>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border/50 pt-8">
              {marketing.highlights.map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            {heroImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl border border-border/60 shadow-elevated">
                  <Image
                    src={heroImages[0]}
                    alt="Fresh stone-baked pizza"
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                      Order direct · Save more
                    </p>
                    <p className="mt-1 font-heading text-xl font-bold leading-snug text-foreground">
                      No commission. No hidden fees.
                    </p>
                  </div>
                </div>
                {heroImages.slice(1).map((src, i) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60"
                  >
                    <Image
                      src={src}
                      alt={i === 0 ? 'Flame-grilled burger' : 'Tandoori curry'}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative rounded-2xl border border-border/60 bg-surface/40 p-8 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Order direct · Save more
                </p>
                <p className="mt-3 font-heading text-2xl font-bold leading-snug">
                  No commission. No hidden fees. Just great food from your local takeaway.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary" aria-hidden>
                      ✓
                    </span>
                    Full allergen info on every item (UK FSA compliant)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary" aria-hidden>
                      ✓
                    </span>
                    Transparent pricing shown before you pay
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary" aria-hidden>
                      ✓
                    </span>
                    Delivery to {theme.location.shortLabel}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
