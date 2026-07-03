const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin-token');
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API error ${res.status}`);
  }
  return res.json();
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  type: string;
  displayTotal: string;
  paymentStatus: string;
  customerEmail?: string;
  deliveryAddress?: Record<string, string>;
  items: Array<{ name: string; quantity: number; allergens: string[] }>;
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  displayPrice: string;
  isAvailable: boolean;
  category?: { name: string };
}
