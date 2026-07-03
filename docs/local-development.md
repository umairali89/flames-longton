# Local Development Guide

## Prerequisites

- Node.js 20+ (use `nvm use` — `.nvmrc` specifies v22)
- pnpm 9+
- Docker Desktop or Docker Engine

## Setup

### 1. Infrastructure

```bash
docker compose up -d
docker compose ps   # verify postgres + redis are healthy
```

### 2. Environment variables

Copy `.env.example` to `.env` at the repo root. Key variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection (Docker default works) |
| `REDIS_URL` | Redis connection |
| `JWT_SECRET` | API auth signing |
| `STRIPE_SECRET_KEY` | Card payments (test mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Elements on checkout |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/v1` |

### 3. Database

```bash
pnpm install
pnpm db:migrate    # creates tables
pnpm db:seed       # 8 categories, 40 products, delivery zones, admin user
pnpm db:studio     # optional Prisma GUI
```

### 4. Run apps

```bash
pnpm dev
```

Or individually:

```bash
pnpm --filter @flames/api dev
pnpm --filter @flames/web dev
pnpm --filter @flames/admin dev
```

## Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:4000/v1/webhooks/stripe
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`.

Test card: `4242 4242 4242 4242` · any future expiry · any CVC.

## Verification checklist

1. Home page loads with hero, categories, hygiene widget
2. `/menu` shows products with dietary filters
3. Product detail → add to cart → `/cart` → `/checkout`
4. Collection + cash order completes → `/order/[id]` confirmation
5. Admin at `:3001` — login, see order, advance status
6. Admin `/menu` — toggle sold out

## White-labeling a new client

1. Create `packages/theme/src/themes/your-client.ts` using `createClientTheme()`
2. Point `apps/web/src/theme.config.ts` and `apps/admin/src/theme.config.ts` to the new theme
3. Update seed data or use admin CRUD for menu
4. Optionally adjust `logo.shortText`, colours, and business details only

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API can't connect to DB | `docker compose up -d` and check `DATABASE_URL` |
| Empty menu | Run `pnpm db:seed` |
| CORS errors | Ensure `CORS_ORIGINS` includes `http://localhost:3000,http://localhost:3001` |
| Stripe payment fails | Set both Stripe keys; use test mode keys |
