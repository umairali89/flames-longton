import { baseRestaurantTheme } from './base';
import type { RestaurantTheme, ThemeMarketing } from '../types';

export const flamesLongtonTheme: RestaurantTheme = {
  id: 'flames-longton',
  name: 'Flames Longton',
  tagline: 'Family-run takeaway · Over 30 years in Longton',
  logo: {
    text: 'Flames',
    shortText: 'FL',
  },
  location: {
    shortLabel: 'Longton · Stoke-on-Trent',
    city: 'Stoke-on-Trent',
    region: 'Staffordshire',
  },
  marketing: {
    cuisineTags: [
      'Pizza',
      'Burgers',
      'Kebabs',
      'Tandoori',
      'Curries',
      'Fried chicken',
      'Milkshakes',
    ],
    highlights: [
      { label: 'Avg. delivery', value: '~35 min' },
      { label: 'Min. order', value: 'From £10' },
      { label: 'Collection', value: 'Ready in 20m' },
    ],
    trustBadges: ['Est. 30+ years', 'Family run', 'Halal options'],
    categoryIcons: {
      pizza: '🍕',
      burgers: '🍔',
      kebabs: '🥙',
      tandoori: '🔥',
      curries: '🍛',
      'fried-chicken': '🍗',
      sides: '🍟',
      milkshakes: '🥤',
    },
    heroImages: [
      '/images/menu/hero/pizza.jpg',
      '/images/menu/hero/burger.jpg',
      '/images/menu/hero/curry.jpg',
    ],
  },
  colors: {
    ...baseRestaurantTheme.colors,
    primary: '#E85D04',
    primaryHover: '#C44D03',
    accent: '#FFBA08',
    heroGradientFrom: '#2D1000',
    heroGradientTo: '#0F0F12',
  },
  fonts: baseRestaurantTheme.fonts,
  radius: baseRestaurantTheme.radius,
  business: {
    address: '297-299 Uttoxeter Road, Stoke-on-Trent, ST3 5LQ',
    phone: '01782 000000',
    email: 'orders@longtonflames.com',
    openingHours: 'Mon–Thu 4pm–11pm · Fri–Sat 4pm–12am · Sun 4pm–10:30pm',
    deliveryAreas:
      'Longton, Normacot, Weston Coyney, Meir, Blurton, Newstead, Dresden, Fenton & surrounding areas',
  },
};

/**
 * Factory for onboarding a new takeaway client — copy `flames-longton.ts` or call this
 * with overrides while inheriting shared layout tokens, category icons, and defaults.
 */
export function createClientTheme(
  overrides: Pick<RestaurantTheme, 'id' | 'name' | 'tagline' | 'logo' | 'business' | 'location'> & {
    colors?: Partial<RestaurantTheme['colors']>;
    fonts?: Partial<RestaurantTheme['fonts']>;
    radius?: Partial<RestaurantTheme['radius']>;
    marketing?: Partial<ThemeMarketing>;
  },
): RestaurantTheme {
  return {
    ...baseRestaurantTheme,
    ...overrides,
    colors: { ...baseRestaurantTheme.colors, ...overrides.colors },
    fonts: { ...baseRestaurantTheme.fonts, ...overrides.fonts },
    radius: { ...baseRestaurantTheme.radius, ...overrides.radius },
    marketing: {
      ...baseRestaurantTheme.marketing,
      ...overrides.marketing,
      categoryIcons: {
        ...baseRestaurantTheme.marketing.categoryIcons,
        ...overrides.marketing?.categoryIcons,
      },
    },
  };
}
