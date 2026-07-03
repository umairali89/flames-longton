'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider, AdminShell, Card, Badge, Button } from '@flames/ui';
import { activeTheme } from '@/theme.config';
import { api, getToken, type AdminProduct } from '@/lib/api';

export default function AdminMenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const load = async () => {
    try {
      setProducts(await api<AdminProduct[]>('/admin/products'));
    } catch {
      router.push('/login');
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    load();
  }, [router]);

  const toggle = async (id: string, isAvailable: boolean) => {
    await api(`/admin/products/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    });
    load();
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <AdminShell theme={activeTheme} currentPath="/menu">
        <h1 className="mb-6 font-heading text-2xl font-bold">Menu availability</h1>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category?.name}</p>
                  <p className="text-sm text-primary">{p.displayPrice}</p>
                </div>
                <Badge variant={p.isAvailable ? 'success' : 'warning'}>
                  {p.isAvailable ? 'Available' : 'Sold out'}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => toggle(p.id, !p.isAvailable)}
              >
                Mark {p.isAvailable ? 'sold out' : 'available'}
              </Button>
            </Card>
          ))}
        </div>
      </AdminShell>
    </ThemeProvider>
  );
}
