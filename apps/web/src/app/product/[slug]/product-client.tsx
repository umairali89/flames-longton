'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Badge,
  Card,
  AllergenBanner,
  ProductHero,
} from '@flames/ui';
import { activeTheme } from '@/theme.config';
import { api, type Product } from '@/lib/api';
import { getGuestSession, setCartCount } from '@/lib/cart-store';

export function ProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedMods, setSelectedMods] = useState<string[]>(() => {
    const defaults: string[] = [];
    product.modifierGroups?.forEach((g) => {
      const def = g.modifiers.find((m) => m.isDefault);
      if (def) defaults.push(def.id);
    });
    return defaults;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleMod = (groupId: string, modId: string, maxSelect: number) => {
    const group = product.modifierGroups?.find((g) => g.id === groupId);
    if (!group) return;

    const groupModIds = group.modifiers.map((m) => m.id);
    const currentInGroup = selectedMods.filter((id) => groupModIds.includes(id));

    if (currentInGroup.includes(modId)) {
      setSelectedMods(selectedMods.filter((id) => id !== modId));
    } else if (maxSelect === 1) {
      setSelectedMods([...selectedMods.filter((id) => !groupModIds.includes(id)), modId]);
    } else if (currentInGroup.length < maxSelect) {
      setSelectedMods([...selectedMods, modId]);
    }
  };

  const addToCart = async () => {
    setLoading(true);
    setError('');
    try {
      const guestSession = getGuestSession();
      const cart = await api<{ items: { quantity: number }[] }>('/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          quantity,
          modifierIds: selectedMods,
        }),
        guestSession,
      });
      const count = cart.items.reduce((s, i) => s + i.quantity, 0);
      setCartCount(count);
      router.push('/cart');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      <ProductHero
        theme={activeTheme}
        name={product.name}
        imageUrl={product.imageUrl}
        categorySlug={product.category?.slug}
      />

      <div className="animate-fade-in">
        {product.category ? (
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
            {product.category.name}
          </p>
        ) : null}

        <div className="mb-3 flex flex-wrap gap-2">
          {product.dietaryTags.map((tag) => (
            <Badge key={tag} variant="dietary" className="capitalize">
              {tag}
            </Badge>
          ))}
          {!product.isAvailable ? <Badge variant="warning">Sold out</Badge> : null}
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
        <p className="mt-3 text-3xl font-bold text-primary">{product.displayPrice}</p>
        {product.calories ? (
          <p className="mt-1 text-sm text-muted-foreground">{product.calories} kcal per serving</p>
        ) : null}
        {product.description ? (
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
        ) : null}

        {product.modifierGroups?.map((group) => (
          <Card key={group.id} className="mt-6">
            <p className="font-semibold">
              {group.name}
              {group.required ? <span className="text-danger"> *</span> : null}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.modifiers.map((mod) => {
                const selected = selectedMods.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => toggleMod(group.id, mod.id, group.maxSelect)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      selected
                        ? 'border-primary bg-primary/15 text-primary shadow-glow'
                        : 'border-border hover:border-primary/40 hover:bg-muted/50'
                    }`}
                  >
                    {mod.name}
                    {mod.pricePence > 0 ? ` (+£${(mod.pricePence / 100).toFixed(2)})` : ''}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}

        <div className="mt-6">
          <AllergenBanner allergens={product.allergens} />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center self-start rounded-xl border border-border bg-surface-elevated">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center text-xl text-muted-foreground hover:text-foreground"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-12 text-center text-lg font-bold">{quantity}</span>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center text-xl text-muted-foreground hover:text-foreground"
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <Button
            size="lg"
            fullWidth
            loading={loading}
            onClick={addToCart}
            disabled={!product.isAvailable}
          >
            Add to basket — {product.displayPrice}
          </Button>
        </div>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      </div>
    </div>
  );
}
