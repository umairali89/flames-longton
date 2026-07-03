'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider, AdminShell, Card, Badge, Button } from '@flames/ui';
import { ORDER_STATUS_LABELS, type OrderStatus } from '@flames/shared';
import { activeTheme } from '@/theme.config';
import { api, getToken, type AdminOrder } from '@/lib/api';

const STATUS_FLOW: OrderStatus[] = [
  'received',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [userEmail, setUserEmail] = useState('');

  const loadOrders = useCallback(async () => {
    try {
      const data = await api<AdminOrder[]>('/admin/orders');
      setOrders(data);
    } catch {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    const email = localStorage.getItem('admin-email');
    if (email) setUserEmail(email);
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [loadOrders, router]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await api(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    loadOrders();
    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-email');
    router.push('/login');
  };

  const nextStatus = (current: string): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(current as OrderStatus);
    if (idx >= 0 && idx < STATUS_FLOW.length - 1) return STATUS_FLOW[idx + 1];
    return null;
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <AdminShell
        theme={activeTheme}
        currentPath="/"
        userEmail={userEmail}
        onLogout={logout}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Live orders</h1>
            <p className="text-sm text-muted-foreground">Auto-refreshes every 10 seconds</p>
          </div>
          <Badge variant="success">{orders.length} active</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {orders.length === 0 ? (
              <Card>
                <p className="text-muted-foreground">No orders yet. Place a test order from the customer site.</p>
              </Card>
            ) : (
              orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => setSelected(order)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    selected?.id === order.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-surface hover:border-primary/30'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-mono font-bold">{order.orderNumber}</span>
                    <Badge variant="primary">
                      {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground capitalize">
                    {order.type} · {order.displayTotal}
                  </p>
                </button>
              ))
            )}
          </div>

          {selected ? (
            <Card className="sticky top-4 h-fit">
              <h2 className="font-heading text-xl font-bold">{selected.orderNumber}</h2>
              <p className="text-sm text-muted-foreground">{selected.customerEmail || 'Guest'}</p>

              <ul className="mt-4 space-y-2">
                {selected.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                  </li>
                ))}
              </ul>

              {selected.deliveryAddress ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  📍 {selected.deliveryAddress.line1}, {selected.deliveryAddress.postcode}
                </p>
              ) : null}

              {nextStatus(selected.status) ? (
                <Button
                  className="mt-6"
                  fullWidth
                  onClick={() => updateStatus(selected.id, nextStatus(selected.status)!)}
                >
                  Mark as {ORDER_STATUS_LABELS[nextStatus(selected.status)!]}
                </Button>
              ) : (
                <Badge variant="success" className="mt-6">
                  Order complete
                </Badge>
              )}
            </Card>
          ) : null}
        </div>
      </AdminShell>
    </ThemeProvider>
  );
}
