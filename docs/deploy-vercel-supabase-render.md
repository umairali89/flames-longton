# Deploy: Vercel + Supabase + Render API

This setup hosts:

- `apps/web` on Vercel (free)
- `apps/api` on Render (free web service)
- PostgreSQL on Supabase (free tier)

## 1) Create Supabase database

1. Create a new Supabase project.
2. In Supabase, open **Project Settings -> Database**.
3. Copy the **Direct connection** PostgreSQL URI and append `?sslmode=require`.

Example:

`postgresql://postgres:<PASSWORD>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require`

## 2) Deploy API on Render

1. In Render, create Blueprint from this repo (`render.yaml`).
2. Set required API env vars in Render:
   - `DATABASE_URL` = Supabase URI from step 1
   - `CORS_ORIGINS` = your Vercel URL(s), comma-separated
     - Example: `https://flames-longton.vercel.app,https://flames-longton-git-master-<team>.vercel.app`
3. Optional API env vars:
   - `REDIS_URL` (leave default `memory` for demo)
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. Deploy and wait for service to become healthy.
5. Copy Render API public URL:
   - Example: `https://flames-api.onrender.com`

The API startup runs:

- `prisma migrate deploy`
- `prisma seed`
- Nest API server

## 3) Deploy web on Vercel

1. Import this GitHub repo in Vercel.
2. Set **Root Directory** to `apps/web`.
3. Vercel will use `apps/web/vercel.json` build/install commands.
4. Set web env vars in Vercel:
   - `NEXT_PUBLIC_API_URL` = `<render-api-url>/v1`
     - Example: `https://flames-api.onrender.com/v1`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional)
5. Deploy.

## 4) Verify

- Web opens and menu loads from API.
- API docs available at `<render-api-url>/docs`.
- Admin login (seed data): `admin@flameslongton.local` / `admin123`

## Notes

- Render free services sleep after inactivity.
- With `REDIS_URL=memory`, carts are not durable across API restarts.
- For persistent carts, use Upstash Redis and set `REDIS_URL`.
