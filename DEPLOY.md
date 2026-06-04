# Vestige — Setup & Deploy Guide

Vestige is now a **full-stack e-commerce platform**: PostgreSQL database (Prisma), customer + admin auth (NextAuth), persisted orders, inventory, discounts, reviews, search, wishlist, newsletter, and an admin dashboard at `/admin`.

---

## Step 1 — Install dependencies

```bash
npm install
```

This also runs `prisma generate` automatically (via the `postinstall` script).

---

## Step 2 — Create a PostgreSQL database (required)

Pick one free hosted option and copy its **connection string**:

- **Neon** — https://neon.tech (recommended; serverless Postgres, great with Vercel)
- **Supabase** — https://supabase.com (Project → Settings → Database → Connection string)

You'll paste this into `DATABASE_URL` next.

---

## Step 3 — Environment variables

```bash
copy .env.local.example .env.local
```

Fill in `.env.local`:

```
# Database — from Neon/Supabase
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"

# Auth — generate a secret:  openssl rand -base64 32   (or any long random string)
NEXTAUTH_SECRET="your-long-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Seed admin login (used by the seed script)
ADMIN_EMAIL="admin@vestige.com"
ADMIN_PASSWORD="admin12345"

# Stripe — https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...        # from `stripe listen` (Step 6)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google sign-in (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Google OAuth (optional)
1. https://console.cloud.google.com/apis/credentials → **Create credentials → OAuth client ID → Web application**
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (add your production URL too)
3. Paste the client ID/secret into `.env.local`. If left blank, the Google button simply won't be active.

---

## Step 4 — Create the schema & seed data

```bash
npx prisma migrate dev --name init   # creates all tables
npm run db:seed                      # loads 8 products, variants, admin user, coupons, sample orders
```

Inspect anytime with:

```bash
npm run db:studio
```

Seeded logins:
- **Admin** → the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set (default `admin@vestige.com` / `admin12345`)
- **Demo customer** → `demo@vestige.com` / `password123`
- **Coupons** → `WELCOME10` (10% off), `VESTIGE20` (20% off over $150), `FREESHIP` ($10 off over $50)

---

## Step 5 — Run locally

```bash
npm run dev
```

- Storefront: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin (sign in with the admin account)

---

## Step 6 — Stripe webhook (for order fulfillment)

Orders are only marked **PAID** (and stock decremented) when Stripe confirms payment via webhook. Locally, install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`. Test card: `4242 4242 4242 4242`, any future expiry/CVC.

---

## Step 7 — Deploy to Vercel

1. Push to GitHub (create the repo **empty** — no README/.gitignore/license — to avoid unrelated-history push errors):
   ```bash
   git init
   git add .
   git commit -m "full-stack vestige"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vestige.git
   git push -u origin main
   ```
2. Import the repo at https://vercel.com → **Add New → Project**.
3. Add **all** the environment variables from `.env.local` (use the Neon/Supabase URL, set `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your Vercel domain).
4. In the Stripe dashboard, create a webhook endpoint pointing at `https://YOUR_DOMAIN/api/webhooks/stripe` (event `checkout.session.completed`) and put its signing secret in `STRIPE_WEBHOOK_SECRET`.
5. Deploy. The `build` script runs `prisma generate` automatically. Run `npx prisma migrate deploy` against the production DB (Vercel can do this via a build step or run it once locally pointed at the prod `DATABASE_URL`).

Every future `git push` to `main` redeploys automatically.

---

## Going live with real payments

1. Switch Stripe from Test to Live mode; replace the keys in Vercel.
2. Update the live webhook signing secret.
3. Update `NEXT_PUBLIC_BASE_URL` / `NEXTAUTH_URL` to your real domain and redeploy.

---

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `Environment variable not found: DATABASE_URL` | `.env.local` missing/blank | Add your Neon/Supabase connection string |
| `Can't reach database server` | Wrong URL or DB asleep | Re-copy the connection string; Neon free tier may need a moment to wake |
| `PrismaClientInitializationError` on Vercel | Migrations not applied to prod DB | Run `npx prisma migrate deploy` against the production `DATABASE_URL` |
| Orders stay `PENDING` | Webhook not running/secret wrong | Run `stripe listen …` locally; set the correct `STRIPE_WEBHOOK_SECRET` |
| Google button does nothing | OAuth creds blank | Add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` |
| `module-not-found` | Deps not installed | `npm install` |
