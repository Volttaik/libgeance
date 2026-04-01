# Libgeance

A Next.js 15 e-commerce application for softly crafted fashion ("Libgeance — Wear Your Story"). Migrated from Vercel to Replit.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS v4 + Radix UI components
- **Animation**: Framer Motion
- **Runtime**: Node.js 20

## Architecture

- `src/app/` — Next.js App Router pages
  - `src/app/shop-api/` — API routes (auth, products, categories, orders, upload)
  - `src/app/admin/` — Admin dashboard
  - `src/app/checkout/` — Checkout flow
  - `src/app/login/` and `src/app/register/` — Auth pages
- `src/components/` — Shared UI components (shadcn/ui based)
- `src/context/` — React context providers (Cart, Auth)
- `src/datahooks/` — Data fetching hooks
- `src/lib/` — Utilities and Supabase client setup
- `src/pages/` — Legacy pages directory (not-found)

## Environment Variables

Required secrets (set in Replit Secrets):
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — Supabase anonymous/publishable key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only, never exposed to client)

## Running the App

- **Dev**: `npm run dev` (port 5000)
- **Build**: `npm run build`
- **Start**: `npm run start` (port 5000)

The workflow "Start application" runs `npm run dev` and serves on port 5000.

## Database Schema

See `supabase-schema.sql` for the full database schema.
