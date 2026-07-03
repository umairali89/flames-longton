export * from './types';
export * from './create-theme-vars';
export * from './themes/base';
export * from './themes/flames-longton';
export * from './themes/example-client';

export function getCategoryIcon(
  theme: import('./types').RestaurantTheme,
  categorySlug: string,
): string {
  return theme.marketing.categoryIcons[categorySlug] ?? '🍽️';
}
