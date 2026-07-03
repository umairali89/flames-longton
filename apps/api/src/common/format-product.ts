import { formatPricePence } from '@flames/shared';

export function formatProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  pricePence: number;
  imageUrl: string | null;
  allergens: unknown;
  dietaryTags: unknown;
  calories: number | null;
  prepTimeMinutes: number;
  isAvailable: boolean;
  category?: { id: string; name: string; slug: string };
  modifierGroups?: Array<{
    id: string;
    name: string;
    minSelect: number;
    maxSelect: number;
    required: boolean;
    modifiers: Array<{
      id: string;
      name: string;
      pricePence: number;
      isDefault: boolean;
    }>;
  }>;
}) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    pricePence: product.pricePence,
    displayPrice: formatPricePence(product.pricePence),
    imageUrl: product.imageUrl,
    allergens: product.allergens as string[],
    dietaryTags: product.dietaryTags as string[],
    calories: product.calories,
    prepTimeMinutes: product.prepTimeMinutes,
    isAvailable: product.isAvailable,
    category: product.category,
    modifierGroups: product.modifierGroups?.map((g) => ({
      id: g.id,
      name: g.name,
      minSelect: g.minSelect,
      maxSelect: g.maxSelect,
      required: g.required,
      modifiers: g.modifiers.map((m) => ({
        id: m.id,
        name: m.name,
        pricePence: m.pricePence,
        displayPrice: formatPricePence(m.pricePence),
        isDefault: m.isDefault,
      })),
    })),
  };
}
