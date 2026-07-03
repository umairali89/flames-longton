export const ORDER_STATUSES = [
  'received',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Order received',
  preparing: 'Preparing',
  ready: 'Ready',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const DIETARY_TAGS = ['halal', 'vegetarian', 'vegan'] as const;
export type DietaryTag = (typeof DIETARY_TAGS)[number];

export function formatPricePence(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export const UK_POSTCODE_REGEX =
  /^([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})$/i;
