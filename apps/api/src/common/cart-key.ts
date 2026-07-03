export function getCartKey(userId?: string, guestSessionId?: string): string {
  if (userId) return `cart:user:${userId}`;
  if (guestSessionId) return `cart:guest:${guestSessionId}`;
  throw new Error('Cart requires userId or guestSessionId');
}

export const CART_TTL = 60 * 60 * 24 * 7; // 7 days
