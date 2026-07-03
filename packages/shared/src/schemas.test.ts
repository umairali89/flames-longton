import { describe, expect, it } from 'vitest';
import { checkoutQuoteSchema, createOrderSchema } from './schemas';

describe('createOrderSchema', () => {
  it('requires allergen acknowledgment', () => {
    const result = createOrderSchema.safeParse({
      orderType: 'collection',
      paymentMethod: 'cash',
      allergenAcknowledged: false,
      items: [{ productId: '00000000-0000-4000-8000-000000000001', quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid collection order', () => {
    const result = createOrderSchema.safeParse({
      orderType: 'collection',
      paymentMethod: 'cash',
      allergenAcknowledged: true,
      items: [{ productId: '00000000-0000-4000-8000-000000000001', quantity: 1 }],
    });
    expect(result.success).toBe(true);
  });
});

describe('checkoutQuoteSchema', () => {
  it('requires postcode for delivery quotes', () => {
    const result = checkoutQuoteSchema.safeParse({
      orderType: 'delivery',
      items: [{ productId: '00000000-0000-4000-8000-000000000001', quantity: 1 }],
    });
    expect(result.success).toBe(true);
  });
});
