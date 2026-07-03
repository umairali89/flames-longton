import { ProductCard, MenuLayout, EmptyState } from '@flames/ui';
import { activeTheme } from '@/theme.config';
import { api, type Product, type Category } from '@/lib/api';

interface MenuPageProps {
  searchParams: Promise<{ category?: string; dietary?: string; q?: string }>;
}

const dietaryFilters = ['halal', 'vegetarian', 'vegan'] as const;

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.dietary) query.set('dietary', params.dietary);
  if (params.q) query.set('q', params.q);

  let categories: Category[] = [];
  let products: Product[] = [];
  try {
    [categories, products] = await Promise.all([
      api<Category[]>('/categories'),
      api<Product[]>(`/products?${query.toString()}`),
    ]);
  } catch {
    /* API may be offline during first setup */
  }

  return (
    <MenuLayout
      theme={activeTheme}
      categories={categories}
      activeCategory={params.category}
      activeDietary={params.dietary}
      dietaryFilters={dietaryFilters}
      hasProducts={products.length > 0}
      emptyState={
        <EmptyState
          title="No items found"
          description="Make sure the API is running and the database is seeded, or try a different filter."
          actionLabel="Back home"
          actionHref="/"
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} theme={activeTheme} />
        ))}
      </div>
    </MenuLayout>
  );
}
