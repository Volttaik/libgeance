# Libgeance

A Next.js 15 e-commerce application for softly crafted fashion ("Libgeance — Wear Your Story").

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Database**: Turso / libSQL (local SQLite via `@libsql/client`) — stored in `libgeance.db`
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Styling**: Tailwind CSS v4 + Radix UI components
- **Animation**: Framer Motion
- **Runtime**: Node.js 20

## Architecture

- `src/app/` — Next.js App Router pages
  - `src/app/shop-api/` — API routes:
    - `products/` — CRUD with search (`?q=`) and category filter (`?category=`)
    - `categories/` — CRUD
    - `events/` — Event card CRUD
    - `settings/` — Store settings (WhatsApp number)
    - `orders/` — Order management
    - `upload/` — Local file upload (saves to `public/uploads/`)
    - `auth/` — User auth (login, register, me, logout)
    - `admin/` — Admin auth (login, logout)
  - `src/app/admin/` — Admin dashboard (Products, Categories, Events, Orders, Settings tabs)
  - `src/app/search/` — Fully functional search page
  - `src/app/checkout/` — Checkout flow
  - `src/app/login/` and `src/app/register/` — Auth pages
- `src/components/` — Shared UI components
  - `ProductGrid.tsx` — Product grid with category filter pills, eye icon quick-view, event cards
  - `ProductModal.tsx` — Quick-view modal with full image, description, WhatsApp button, Add to Bag
  - `EventCard.tsx` — Wide promotional banner card (90% width, 180px height)
  - `Navbar.tsx` — Navigation
- `src/context/` — React context providers (Cart, Auth)
- `src/lib/` — Utilities
  - `turso.ts` — libSQL client + `initDb()` (creates all tables on first run)
  - `auth.ts` — JWT signing/verification, admin credentials

## Database Schema (auto-created on first run)

Tables: `users`, `categories`, `products`, `orders`, `order_items`, `events`, `settings`

- `events`: title, subtitle, description, badge, ctaLabel, ctaLink, image, position (top|inline), active
- `settings`: key-value store — `whatsapp_number` for WhatsApp contact

## Key Features

- **Eye icon on product card** → opens `ProductModal` with full image, price, description, Add to Bag + WhatsApp button
- **WhatsApp button** → opens wa.me link with product snapshot (name, price, image URL, description)
- **WhatsApp number** → configured by admin in Settings tab
- **Search** → live search by product name, description, category
- **Category filter** → pill filter bar on homepage
- **Event cards** → wide banner cards (90% width) placeable at top or inline between categories; managed from admin Events tab

## Admin Credentials

Set in `src/lib/auth.ts`:
- Username: `admin`
- Password: `liquid4*`

## Running the App

- **Dev**: `npm run dev` (port 5000)
- **Build**: `npm run build`
- **Start**: `npm run start` (port 5000)

No environment variables required — database is local SQLite.

## Image Uploads

Uploaded images are saved to `public/uploads/` and served as static files.
