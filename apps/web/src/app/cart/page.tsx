'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  AllergenBanner,
  PageHeader,
  EmptyState,
  OrderSummary,
  ButtonLink,
} from '@flames/ui';
import { api, type CartResponse } from '@/lib/api';
import { getGuestSession, setCartCount } from '@/lib/cart-store';

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const data = await api<CartResponse>('/cart', { guestSession: getGuestSession() });
      setCart(data);
      const count = data.items.reduce((s, i) => s + i.quantity, 0);
      setCartCount(count);
    } catch {
      setCart({ items: [], subtotalPence: 0, displaySubtotal: '£0.00' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const allAllergens = [...new Set(cart?.items.flatMap((i) => i.allergens) || [])];

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">
        Loading basket…
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHeader title="Your basket" />
        <EmptyState
          title="Your basket is empty"
          description="Add some delicious food from our menu to get started."
          actionLabel="Browse menu"
          actionHref="/menu"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Your basket"
        description={`${cart.items.length} item${cart.items.length > 1 ? 's' : ''} — review allergens before checkout`}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item, idx) => (
            <Card key={`${item.productId}-${idx}`}>
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  {item.modifiers.length > 0 ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.modifiers.map((m) => m.name).join(' · ')}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="shrink-0 font-bold text-primary">{item.displayPrice}</p>
              </div>
            </Card>
          ))}

          <AllergenBanner allergens={allAllergens} title="Allergens in your basket" />
        </div>

        <OrderSummary
          lines={[
            { label: 'Subtotal', value: cart.displaySubtotal },
            {
              label: 'Total',
              value: cart.displaySubtotal,
              emphasis: true,
            },
          ]}
          footer="Delivery fee calculated at checkout — no hidden charges"
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href="/menu" variant="outline" fullWidth className="sm:w-auto">
          Add more items
        </ButtonLink>
        <ButtonLink href="/checkout" fullWidth size="lg" className="sm:min-w-[200px]">
          Proceed to checkout
        </ButtonLink>
      </div>
    </div>
  );
}
