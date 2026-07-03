# Flames Longton — Restaurant E-Commerce Platform

A white-label, UK-compliant takeaway ordering platform. Built as a Turborepo monorepo with a reusable theme system for onboarding similar restaurant clients.

## Quick start (local)

**Requirements:** Node 20+, Docker, pnpm 9+

```bash
# 1. Start Postgres + Redis
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Environment
cp .env.example .env
# Add Stripe test keys if using card payments

# 4. Database
pnpm db:migrate
pnpm db:seed

# 5. Run all apps
pnpm dev
```

| App | URL |
|-----|-----|
| Customer web | http://localhost:3000 |
| Admin dashboard | http://localhost:3001 |
| API + Swagger | http://localhost:4000/docs |

**Admin login:** `admin@flameslongton.local` / `admin123`

## White-label theming

Swap the client brand by editing one file per app:

- `apps/web/src/theme.config.ts`
- `apps/admin/src/theme.config.ts`

Or use `createClientTheme()` from `@flames/theme` to generate a new restaurant theme:

```typescript
import { createClientTheme } from '@flames/theme';

export const activeTheme = createClientTheme({
  id: 'new-client',
  name: 'Pizza Palace',
  tagline: 'Best pizza in town',
  logo: { text: 'Pizza Palace', shortText: 'PP' },
  business: { address: '...', phone: '...', openingHours: '...' },
  colors: { primary: '#C1121F' }, // override brand colour only
});
```

All UI components in `@flames/ui` consume CSS variables from the active theme — no component changes needed for new clients.

## Project structure

```
apps/web      — Customer ordering (Next.js 15)
apps/admin    — Staff dashboard (Next.js 15)
apps/api      — REST API (NestJS)
packages/theme — White-label theme tokens & client configs
packages/ui   — Reusable layout & component library
packages/shared — Allergens, validators, constants
packages/database — Prisma schema, migrations, seed
```

## Tests

```bash
pnpm test           # API unit tests + shared validators
pnpm test:e2e       # Playwright (requires running services)
```

## Documentation

- [Local development guide](docs/local-development.md)
- [UK compliance checklist](docs/compliance-checklist.md)
- [API overview](docs/api/openapi.yaml)
