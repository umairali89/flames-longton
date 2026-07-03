import Link from 'next/link';
import { ButtonLink, PageHeader } from '@flames/ui';
import { api, type Product } from '@/lib/api';
import { ProductClient } from './product-client';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: Product | null = null;
  try {
    product = await api<Product>(`/products/${slug}`);
  } catch {
    product = null;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <ButtonLink href="/menu" className="mt-4">
          Back to menu
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={product.name}
        description="Review allergens and customisation options before adding to your basket"
        action={
          <ButtonLink href="/menu" variant="outline" size="sm">
            ← Back to menu
          </ButtonLink>
        }
        className="lg:hidden"
      />
      <div className="mb-6 hidden lg:block">
        <Link href="/menu" className="text-sm text-muted-foreground no-underline hover:text-primary">
          ← Back to menu
        </Link>
      </div>
      <ProductClient product={product} />
    </div>
  );
}
