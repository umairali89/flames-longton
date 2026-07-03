import { createClientTheme } from './flames-longton';

/**
 * Example second client — demonstrates white-label reuse.
 * Swap `activeTheme` in apps/web/src/theme.config.ts to preview.
 */
export const spiceKitchenTheme = createClientTheme({
  id: 'spice-kitchen',
  name: 'Spice Kitchen',
  tagline: 'Authentic curries & grills · Order direct',
  logo: { text: 'Spice', shortText: 'SK' },
  location: {
    shortLabel: 'Hanley · Stoke-on-Trent',
    city: 'Stoke-on-Trent',
    region: 'Staffordshire',
  },
  marketing: {
    cuisineTags: ['Curries', 'Biryani', 'Grills', 'Naan', 'Desserts'],
    trustBadges: ['Halal certified', 'Fresh daily', 'No platform fees'],
    highlights: [
      { label: 'Delivery', value: '~40 min' },
      { label: 'Min. order', value: 'From £12' },
      { label: 'Collection', value: '15 min' },
    ],
  },
  colors: {
    primary: '#059669',
    primaryHover: '#047857',
    accent: '#FBBF24',
    heroGradientFrom: '#022C22',
    heroGradientTo: '#0F0F12',
  },
  business: {
    address: '1 Example Street, Stoke-on-Trent, ST1 1AA',
    phone: '01782 111111',
    openingHours: 'Daily 12pm–11pm',
    deliveryAreas: 'Stoke-on-Trent and surrounding areas',
  },
});
