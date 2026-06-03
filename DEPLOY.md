# Vestige — Deploy Guide

## The #1 reason pushing to GitHub fails

When you create a repo on GitHub **with a README** (or any file), GitHub makes an initial commit.
Your local project also has commits. Git sees these as **unrelated histories** and rejects your push.

**Fix:** Always create your GitHub repo completely empty — no README, no .gitignore, no license file.

---

## Step 1 — Install dependencies

Open a terminal in your `C:\Vestige` folder:

```bash
npm install
```

---

## Step 2 — Set up your environment variables

Copy the example file and fill in your Stripe keys:

```bash
copy .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Get your Stripe test keys at: https://dashboard.stripe.com/apikeys

---

## Step 3 — Run locally

```bash
npm run dev
```

Visit http://localhost:3000 — your store should be live.

---

## Step 4 — Create the GitHub repo (EMPTY)

1. Go to https://github.com/new
2. Name it `vestige` (or whatever you like)
3. **Leave everything unchecked** — no README, no .gitignore, no license
4. Click **Create repository**
5. Copy the repo URL (e.g. `https://github.com/YOUR_USERNAME/vestige.git`)

---

## Step 5 — Push your code

In your terminal (inside the Vestige folder):

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vestige.git
git push -u origin main
```

That's it. Your code is on GitHub.

---

## Step 6 — Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New → Project**
3. Import your `vestige` repo
4. Vercel auto-detects Next.js — no build config needed
5. Before clicking Deploy, go to **Environment Variables** and add:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → your Stripe publishable key
   - `STRIPE_SECRET_KEY` → your Stripe secret key
   - `NEXT_PUBLIC_BASE_URL` → your Vercel URL (e.g. `https://vestige.vercel.app`)
6. Click **Deploy**

Your site will be live at `https://vestige.vercel.app` (or your custom domain).

---

## Step 7 — Every future update

After making changes:

```bash
git add .
git commit -m "describe what you changed"
git push
```

Vercel automatically redeploys on every push to `main`. No extra steps.

---

## Going live with real payments

When you're ready to accept real money:
1. In your Stripe dashboard, switch from Test to Live mode
2. Replace the test keys in your Vercel environment variables with live keys
3. Update `NEXT_PUBLIC_BASE_URL` to your real domain
4. Redeploy

---

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `rejected — non-fast-forward` | Repo wasn't empty when created | Delete the remote repo and create a new empty one, or run `git pull origin main --allow-unrelated-histories` then push again |
| `src refspec main does not match any` | No commits yet | Run `git add . && git commit -m "init"` first |
| `Stripe publishable key is missing` | .env.local not set up | Add your keys to .env.local (local) or Vercel env vars (production) |
| `Module not found` | Dependencies not installed | Run `npm install` |
