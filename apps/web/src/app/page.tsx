import {
  HeroSection,
  Section,
  CategoryCard,
  FeatureGrid,
  ButtonLink,
} from '@flames/ui';
import { activeTheme } from '@/theme.config';
import { api, type Category } from '@/lib/api';

async function getCategories(): Promise<Category[]> {
  try {
    return await api<Category[]>('/categories', { cache: 'no-store' } as RequestInit);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <HeroSection theme={activeTheme} />

      <Section>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Fresh from the kitchen
            </p>
            <h2 className="mt-1 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Explore our menu
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Halal options available · Full allergen info on every item · Order direct with
              transparent pricing
            </p>
          </div>
          <ButtonLink href="/menu" variant="outline" size="lg" className="shrink-0">
            View full menu
          </ButtonLink>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              theme={activeTheme}
              slug={cat.slug}
              name={cat.name}
              description={cat.description}
              imageUrl={cat.imageUrl}
              productCount={cat.productCount}
            />
          ))}
        </div>
      </Section>

      <Section variant="muted">
        <FeatureGrid
          title="Why order direct?"
          subtitle="Support your local family-run takeaway — no third-party commissions, no surprise fees at checkout."
          features={[
            {
              icon: '💷',
              title: 'Transparent pricing',
              description: 'All delivery fees and charges shown upfront before you pay (DMCC compliant).',
            },
            {
              icon: '⚠️',
              title: 'Allergen safe',
              description: 'Full FSA allergen information at product, basket, and checkout — Natasha\'s Law compliant.',
            },
            {
              icon: '📍',
              title: 'Local delivery',
              description: `Fast delivery across ${activeTheme.business.deliveryAreas?.split(',')[0] ?? 'your area'} and surrounding postcodes.`,
            },
          ]}
        />
      </Section>
    </>
  );
}
