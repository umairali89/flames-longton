# @flames/ui — Shared restaurant e-commerce components

Theme-aware layout and commerce components used by customer web and admin apps. All colours and radii come from CSS variables set by `ThemeProvider` + `@flames/theme`.

## White-labelling

1. Define a theme in `@flames/theme` (see `packages/theme/README.md`).
2. Wrap your app in `<ThemeProvider theme={activeTheme}>`.
3. Pass `theme={activeTheme}` to layout components (`SiteHeader`, `HeroSection`, `MenuLayout`, `CategoryCard`, `ProductCard`, `ProductHero`).

Swap `activeTheme` in `apps/web/src/theme.config.ts` — no component code changes required.

## Layout primitives

| Component | Purpose |
|-----------|---------|
| `SiteHeader` / `SiteFooter` | Branded chrome |
| `HeroSection` | Home hero with trust badges & stats from theme |
| `MobileBottomNav` | Mobile thumb-zone navigation |
| `PageHeader` | Consistent page titles |
| `Section` | Home page content blocks |
| `MenuLayout` | Sidebar categories (desktop) + filter chips |
| `CheckoutStepper` | 3-step checkout progress |
| `OrderSummary` | Sticky price breakdown |
| `SegmentedControl` | Delivery/collection, payment method toggles |
| `EmptyState` | Cart / menu empty states |
| `AdminShell` | Staff dashboard layout |

## Commerce

| Component | Purpose |
|-----------|---------|
| `ProductCard` | Menu grid item |
| `ProductHero` | Product detail image area |
| `CategoryCard` | Home page category tiles |
| `AllergenBanner` | UK FSA allergen disclosure |
| `CookieBanner` | PECR consent |
