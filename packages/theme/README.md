# @flames/theme — Multi-client restaurant theme system

Reusable design tokens for takeaway / restaurant e-commerce clients. Each client gets a single `RestaurantTheme` object that drives colours, typography, marketing copy, and business details across web and admin apps.

## Quick start — new client

1. Copy `src/themes/flames-longton.ts` or use `createClientTheme()`:

```ts
import { createClientTheme } from '@flames/theme';

export const myClientTheme = createClientTheme({
  id: 'my-takeaway',
  name: 'My Takeaway',
  tagline: 'Your tagline here',
  logo: { text: 'My', shortText: 'MT' },
  location: { shortLabel: 'Area · City', city: 'City', region: 'UK' },
  business: {
    address: '1 High Street',
    phone: '01onal 000000',
    openingHours: 'Daily 12pm–11pm',
  },
  colors: {
    primary: '#059669',
    accent: '#FBBF24',
    heroGradientFrom: '#022C22',
  },
});
```

2. Point the app at your theme:

```ts
// apps/web/src/theme.config.ts
import { myClientTheme } from './themes/my-client'; // or from package
export const activeTheme = myClientTheme;
```

3. Repeat for `apps/admin/src/theme.config.ts`.

## What the theme controls

| Token | Used in |
|-------|---------|
| `colors.*` | Buttons, backgrounds, hero gradient (via CSS variables) |
| `fonts.*` | Headings & body; `googleFontsUrl` loaded by `ThemeProvider` |
| `logo` | Header, admin sidebar |
| `location` | Header subtitle |
| `marketing.cuisineTags` | Hero cuisine list |
| `marketing.highlights` | Hero stats row |
| `marketing.trustBadges` | Hero badges |
| `marketing.categoryIcons` | Menu cards & category navigation |
| `business.*` | Footer, checkout defaults |

## Example second client

See `src/themes/example-client.ts` (`spiceKitchenTheme`) for a green-accent curry house variant.

## CSS variables

`createThemeCssVars(theme)` maps the theme to `--color-primary`, `--font-heading`, etc. Consumed by `@flames/ui` Tailwind preset (`packages/ui/tailwind.preset.js`).
