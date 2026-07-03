'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/cn';

interface MobileBottomNavProps {
  cartCount?: number;
}

const items = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/menu', label: 'Menu', icon: '📋' },
  { href: '/cart', label: 'Basket', icon: '🛒' },
];

export function MobileBottomNav({ cartCount = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <span className="text-lg" aria-hidden>
                {item.icon}
              </span>
              {item.label}
              {item.href === '/cart' && cartCount > 0 ? (
                <span className="absolute right-[calc(50%-24px)] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
