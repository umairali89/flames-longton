'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ThemeProvider,
  SiteHeader,
  SiteFooter,
  CookieBanner,
  MobileBottomNav,
} from '@flames/ui';
import { activeTheme } from '@/theme.config';
import { getCartCount } from '@/lib/cart-store';
import { HygieneWidget } from './hygiene-widget';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  return (
    <ThemeProvider theme={activeTheme}>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader theme={activeTheme} cartCount={cartCount} currentPath={pathname} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <SiteFooter theme={activeTheme} hygieneWidget={<HygieneWidget />} />
        <MobileBottomNav cartCount={cartCount} />
        <CookieBanner />
      </div>
    </ThemeProvider>
  );
}
