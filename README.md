# Vestige — Full-Stack E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-3da639?style=for-the-badge)

Vestige is a production-grade e-commerce platform for a streetwear clothing brand, built from the ground up with the Next.js App Router. It pairs a polished, mobile-first storefront with a complete commerce backend — authentication, a real database, payments, inventory, discounts, reviews, and a metrics-driven admin dashboard.

> Built as a full-stack engineering project: a real database, role-based auth, Stripe payments with webhook fulfillment, and an admin panel — not a template or a no-code store.

## Live Demo

🔗 **[vestige-delta.vercel.app](https://vestige-delta.vercel.app)**

> The site is currently behind a pre-launch passcode gate. Use the access code provided in the application or contact me for early-access credentials.

## Screenshots

<p align="center">
  <img src="docs/screenshots/home.png" alt="Vestige storefront landing page" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/products.png" alt="Product listing with search and filters" width="32%" />
  &nbsp;
  <img src="docs/screenshots/product.png" alt="Product detail page" width="32%" />
  &nbsp;
  <img src="docs/screenshots/admin-dashboard.png" alt="Admin dashboard with KPIs and charts" width="32%" />
</p>


## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, React Server Components) |
| Language | JavaScript (React 18) |
| Styling | Tailwind CSS |
| Database | PostgreSQL (hosted on Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js — credentials + Google OAuth, JWT sessions, role-based access |
| Payments | Stripe Checkout + webhook-driven order fulfillment |
| Charts | Recharts |
| Validation | Zod |
| Hosting | Vercel (serverless) |

## Features

### Storefront
- **Product catalog** served from the database with full-text search, category filtering, sorting, and pagination
- **Product pages** with image galleries, per-variant (size × colour) stock awareness, and "sold out" states
- **Cart** tied to the authenticated user — persisted to the database, cleared on logout, restored on login, with a guest-cart merge on sign-in
- **Customer reviews** with star ratings (moderated before publishing)
- **Wishlist**, **promo codes** applied at checkout, and a working **newsletter** capture
- **Stripe Checkout** with shipping options, discounts, and the ability to **resume payment on a pending order**

### Authentication & Accounts
- Email/password and Google OAuth sign-in
- Role-based access control (`CUSTOMER` / `ADMIN`) enforced in middleware
- Customer account area with order history and order tracking

### Admin Dashboard (`/admin`)
- KPI overview — revenue, orders, average order value, customers — with revenue/orders charts
- Low-stock alerts and best-seller insights
- Full CRUD for **products + inventory**, **orders** (with status workflow), **review moderation**, **coupons**, **customers** (with lifetime value), and **newsletter subscribers** (CSV export)

### Commerce Integrity
- Prices are always re-computed from the database at checkout — client values are never trusted
- A **Stripe webhook** is the source of truth: it marks orders paid, decrements inventory, and records coupon usage
- A configurable **pre-launch passcode gate** (middleware-enforced) that can be switched off at launch via a single environment variable

## Architecture Highlights

```mermaid
flowchart TD
    subgraph Client["Browser"]
        SF["Storefront"]
        AD["Admin Dashboard"]
    end

    subgraph App["Next.js 14 on Vercel"]
        MW["Middleware<br/>launch gate + role-based access"]
        RSC["Server Components"]
        API["Route Handlers (/api)"]
    end

    AUTH["NextAuth<br/>credentials + Google, JWT"]
    DB[("PostgreSQL<br/>Supabase")]
    STRIPE["Stripe Checkout"]

    SF --> MW
    AD --> MW
    MW --> RSC
    MW --> API
    RSC --> DB
    API --> DB
    API --> AUTH
    API -->|create session| STRIPE
    STRIPE -->|webhook: payment succeeded| API
    API -->|mark paid · decrement stock · log coupon use| DB
```

- **Server Components** fetch data directly from PostgreSQL via Prisma; interactive pieces (cart, filters, reviews, admin forms) are isolated client components.
- **Money is stored as integer cents** throughout to avoid floating-point errors, with a single formatting utility.
- **Middleware** handles both the pre-launch gate and role-based route protection (`/admin`, `/account`, `/wishlist`) in one place.
- **Inventory is modelled per variant** (size × colour), so stock, "sold out" states, and low-stock alerts are accurate at the SKU level.

```
app/
  (storefront)      home, products, product detail, cart, checkout, account
  admin/            dashboard, products, orders, reviews, coupons, customers, subscribers
  api/              auth, products, reviews, coupons, cart, orders, checkout, webhooks
components/         storefront + admin UI components
lib/                prisma client, auth config, products, money, coupon, validators
prisma/             schema + seed
middleware.js       launch gate + auth protection
```

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. a free [Supabase](https://supabase.com) or [Neon](https://neon.tech) project)
- A [Stripe](https://stripe.com) account (test mode is fine)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# then fill in DATABASE_URL, NEXTAUTH_SECRET, Stripe keys, etc.

# 3. Create the schema and seed sample data
npm run db:push
npm run db:seed

# 4. Run the dev server
npm run dev
```

Visit `http://localhost:3000`. The seed creates an admin user, a demo customer, the product catalog, and sample data for the dashboard. Sign in to `/admin` with the admin credentials defined in your environment.

### Useful scripts

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run db:push    # sync the Prisma schema to the database
npm run db:seed    # seed sample data
npm run db:studio  # browse the database in Prisma Studio
```

### Environment variables

See [`.env.local.example`](.env.local.example) for the full list — database connection, NextAuth secret, Stripe keys/webhook secret, optional Google OAuth, and the pre-launch gate settings.

## License

Released under the [MIT License](LICENSE).
