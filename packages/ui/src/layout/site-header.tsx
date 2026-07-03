'use client';

import Link from 'next/link';
import type { RestaurantTheme } from '@flames/theme';
import { cn } from '../lib/cn';
import { ButtonLink } from '../button-link';

interface SiteHeaderProps {
  theme: RestaurantTheme;
  cartCount?: number;
  currentPath?: string;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
];

export function SiteHeader({ theme, cartCount = 0, currentPath }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3 no-underline">
          {theme.logo.imageUrl ? (
            <img
              src={theme.logo.imageUrl}
              alt={theme.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-gradient font-heading text-sm font-bold text-primary-foreground shadow-glow">
              {theme.logo.shortText || theme.logo.text.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="hidden min-w-0 sm:block">
            <p className="truncate font-heading text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {theme.logo.text}
            </p>
            <p className="truncate text-xs text-muted-foreground">{theme.location.shortLabel}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium no-underline transition-colors',
                currentPath === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/menu" size="sm" className="hidden sm:inline-flex">
            Order now
          </ButtonLink>
          <ButtonLink href="/cart" variant="secondary" size="sm" className="relative hidden md:inline-flex">
            Basket
            {cartCount > 0 ? (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
