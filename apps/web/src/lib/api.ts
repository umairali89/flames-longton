const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export async function api<T>(
  path: string,
  options: RequestInit & { guestSession?: string; token?: string } = {},
): Promise<T> {
  const { guestSession, token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (guestSession) headers['X-Guest-Session'] = guestSession;

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API error ${res.status}`);
  }
  return res.json();
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  pricePence: number;
  displayPrice: string;
  imageUrl?: string | null;
  allergens: string[];
  dietaryTags: string[];
  calories: number | null;
  isAvailable: boolean;
  category?: { id: string; name: string; slug: string };
  modifierGroups?: Array<{
    id: string;
    name: string;
    minSelect: number;
    maxSelect: number;
    required: boolean;
    modifiers: Array<{ id: string; name: string; pricePence: number; isDefault: boolean }>;
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
  imageUrl?: string | null;
}

export interface CartResponse {
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPricePence: number;
    lineTotalPence: number;
    displayPrice: string;
    allergens: string[];
    modifiers: { id: string; name: string; pricePence: number }[];
  }>;
  subtotalPence: number;
  displaySubtotal: string;
}

export interface CheckoutQuote {
  subtotalPence: number;
  deliveryFeePence: number;
  totalPence: number;
  displaySubtotal: string;
  displayTotal: string;
  displayDeliveryFee: string;
  estimatedMinutes: number;
  items: CartResponse['items'];
}

export interface Order {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  totalPence: number;
  displayTotal: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress?: Record<string, string>;
  items: Array<{
    name: string;
    quantity: number;
    allergens: string[];
    displayPrice: string;
  }>;
}
