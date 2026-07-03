'use client';

const GUEST_KEY = 'flames-guest-session';
const CART_COUNT_KEY = 'flames-cart-count';

export function getGuestSession(): string {
  if (typeof window === 'undefined') return '';
  let session = localStorage.getItem(GUEST_KEY);
  if (!session) {
    session = crypto.randomUUID();
    localStorage.setItem(GUEST_KEY, session);
  }
  return session;
}

export function getCartCount(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(CART_COUNT_KEY) || '0', 10);
}

export function setCartCount(count: number) {
  localStorage.setItem(CART_COUNT_KEY, String(count));
  window.dispatchEvent(new Event('cart-updated'));
}
