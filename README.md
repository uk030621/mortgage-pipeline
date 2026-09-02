# Ledger — Mortgage Pipeline Tracker

A responsive Next.js app for UK mortgage brokers to track mortgages through the
pipeline: enquiry → AIP → application submitted → underwriting → mortgage
offer → exchange → completion. Built with Google sign-in and MongoDB.

## Stack

- Next.js 16 (App Router, React 19)
- NextAuth.js (Google provider, JWT sessions)
- MongoDB + Mongoose
- Tailwind CSS

## Features

- Kanban-style pipeline board, horizontally scrollable on desktop and
  stacked on mobile
- Per-mortgage document checklist (payslips, P60s, proof of deposit, etc.)
  with status tracking
- Offer expiry and completion date deadlines, colour-coded by urgency
- Commission tracker (expected / paid)
- Dashboard summary: active mortgages, pipeline volume, deadlines needing
  attention, expected commission
- Every mortgage is scoped to the signed-in broker's Google account
- Optional email allowlist to restrict who can sign in
- Amounts formatted in GBP (£)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. MongoDB

Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) (or
use a local instance) and grab the connection string.

### 3. Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) →
   APIs & Services → Credentials.
2. Create an OAuth 2.0 Client ID (type: Web application).
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   (and your production URL's equivalent once deployed).
4. Copy the client ID and secret.

### 4. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

- `MONGODB_URI` — your connection string
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from step 3
- `ALLOWED_EMAILS` — optional comma-separated allowlist; leave blank to
  allow any Google account to sign in

### 5. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`.

## Project structure

```
src/
  app/
    api/
      auth/[...nextauth]/route.ts   NextAuth handler
      loans/route.ts                list + create loans
      loans/[id]/route.ts           get + update + delete a loan
    loans/[id]/page.tsx             loan detail (stage, docs, deadlines)
    loans/[id]/edit/page.tsx        edit a loan
    loans/new/page.tsx              create a loan
    login/page.tsx                  Google sign-in
    page.tsx                        pipeline dashboard
  components/                       Sidebar, PipelineBoard, LoanCard, etc.
  lib/                              mongodb connection, auth config, formatting
  models/Loan.ts                    Mongoose schema
  proxy.ts                          protects all routes except /login
                                     (Next.js 16 renamed middleware.ts → proxy.ts)
```

## Notes on scaling this further

- **Multi-broker teams**: loans are scoped by `ownerEmail`. To support a
  brokerage with shared visibility, add a `team` field and adjust the
  query filters in the API routes.
- **Notifications**: deadline urgency is computed client-side. For real
  alerts (email/SMS when a rate lock is about to expire), add a cron job
  (e.g. Vercel Cron) that queries loans with near-term deadlines.
- **Lender directory**: not included here to keep the scaffold focused,
  but would follow the same model/API/page pattern as `Loan`.
- **Async route params**: dynamic route `params` are a `Promise` in this
  version of Next.js. Server code (API routes) awaits it directly —
  `const { id } = await params;`. Client components (the loan detail and
  edit pages) can't `await` in the component body, so they unwrap it with
  React's `use()` hook instead — `const { id } = use(params);`.
