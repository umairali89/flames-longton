import type { RestaurantTheme } from '../types';

const defaultCategoryIcons: RestaurantTheme['marketing']['categoryIcons'] = {
  pizza: '🍕',
  burgers: '🍔',
  kebabs: '🥙',
  tandoori: '🔥',
  curries: '🍛',
  'fried-chicken': '🍗',
  sides: '🍟',
  milkshakes: '🥤',
};

const defaultMarketing: RestaurantTheme['marketing'] = {
  cuisineTags: ['Pizza', 'Burgers', 'Kebabs', 'Curries', 'Sides', 'Drinks'],
  highlights: [
    { label: 'Avg. delivery', value: '~35 min' },
    { label: 'Min. order', value: 'From £10' },
    { label: 'Collection', value: 'Ready in 20m' },
  ],
  trustBadges: ['Family run', 'Order direct', 'No hidden fees'],
  categoryIcons: defaultCategoryIcons,
};

const defaultLocation: RestaurantTheme['location'] = {
  shortLabel: 'Your area',
  city: 'City',
  region: 'UK',
};

/** Shared defaults — override per client in theme files */
export const baseRestaurantTheme: Omit<
  RestaurantTheme,
  'id' | 'name' | 'tagline' | 'logo' | 'business' | 'location' | 'marketing'
> & {
  location: RestaurantTheme['location'];
  marketing: RestaurantTheme['marketing'];
} = {
  location: defaultLocation,
  marketing: defaultMarketing,
  colors: {
    primary: '#E85D04',
    primaryHover: '#D45103',
    primaryForeground: '#FFFFFF',
    secondary: '#1A1A1F',
    secondaryForeground: '#F5F0EB',
    accent: '#F48C06',
    accentForeground: '#1A1A1F',
    background: '#0F0F12',
    surface: '#1A1A1F',
    surfaceElevated: '#242429',
    foreground: '#F5F0EB',
    muted: '#2E2E35',
    mutedForeground: '#A8A29E',
    border: '#3A3A42',
    ring: '#E85D04',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    heroGradientFrom: '#1A0A00',
    heroGradientTo: '#0F0F12',
  },
  fonts: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"DM Sans", system-ui, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@600;700;800&display=swap',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
};
