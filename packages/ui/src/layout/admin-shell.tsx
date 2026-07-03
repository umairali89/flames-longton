'use client';

import Link from 'next/link';
import type { RestaurantTheme } from '@flames/theme';
import { cn } from '../lib/cn';
import { Button } from '../button';

interface AdminShellProps {
  theme: RestaurantTheme;
  children: React.ReactNode;
  currentPath?: string;
  onLogout?: () => void;
  userEmail?: string;
}

const adminNav = [
  { href: '/', label: 'Orders', icon: '📋' },
  { href: '/menu', label: 'Menu', icon: '🍽️' },
];

export function AdminShell({
  theme,
  children,
  currentPath,
  onLogout,
  userEmail,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-gradient text-xs font-bold text-primary-foreground">
              {theme.logo.shortText}
            </span>
            <div>
              <p className="font-heading text-sm font-bold">{theme.name}</p>
              <p className="text-xs text-muted-foreground">Staff dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                currentPath === item.href
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          {userEmail ? (
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          ) : null}
          {onLogout ? (
            <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={onLogout}>
              Sign out
            </Button>
          ) : null}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur lg:px-6">
          <p className="font-heading text-lg font-bold lg:hidden">{theme.name} Admin</p>
          <p className="hidden text-sm text-muted-foreground lg:block">Live order management</p>
          <div className="flex items-center gap-2 lg:hidden">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium',
                  currentPath === item.href ? 'bg-primary/15 text-primary' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
