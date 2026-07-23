# Deploying Nepali Community UK

This app runs entirely on local infra in dev (local `prisma dev` Postgres,
Mailpit for email, local disk for uploads). Going live swaps each of those for
a hosted equivalent via environment variables — no code changes needed beyond
what's already in this repo.

## 1. Push to GitHub

1. Create a new **empty** repository on GitHub (no README/license/gitignore —
   this repo already has all of that).
2. Tell me the repo URL and I'll add it as a remote and push.

## 2. Create a Supabase project (database + image storage)

Use a **new** Supabase project dedicated to this app (don't reuse another
project's database).

1. supabase.com → New project. Pick a name/region, set a strong DB password.
2. **Database connection string**: Project Settings → Database → Connection
   string → "URI" (use the **pooled/transaction** connection string, port
   `6543`, for `DATABASE_URL`; use the **direct** connection string, port
   `5432`, for `DIRECT_DATABASE_URL`). Both go into Vercel env vars in step 4.
3. **Storage bucket**: Storage → New bucket → name it exactly `uploads` →
   toggle **Public bucket** on (listing photos and profile photos need to be
   publicly viewable).
4. **Service role key**: Project Settings → API → `service_role` secret key
   (not the `anon` key — the app needs it to upload on the user's behalf).
   Copy this and the Project URL for `SUPABASE_SERVICE_ROLE_KEY` /
   `SUPABASE_URL`.

Once schema + storage exist, tell me and I'll run
`npx prisma db push` against the real database to create all the tables
(same command already used throughout local dev — safe to run against an
empty database).

## 3. Create a Resend account (production email)

Local dev uses Mailpit; production needs a real email provider so welcome
emails, notifications, and contact-form messages actually deliver.

1. resend.com → sign up → create an API key.
2. Add and verify your domain in Resend (Resend walks you through adding a
   few DNS TXT/CNAME records at your domain registrar — needed so emails
   from `@yourdomain` don't get marked as spam).

## 4. Create the Vercel project

1. vercel.com → New Project → import the GitHub repo from step 1.
2. Framework preset: Next.js (auto-detected). No build command changes needed.
3. **Environment variables** — add all of these (Project Settings →
   Environment Variables, scope: Production + Preview):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Supabase pooled connection string (port 6543) |
   | `DIRECT_DATABASE_URL` | Supabase direct connection string (port 5432) |
   | `NEXTAUTH_SECRET` | generate with `openssl rand -base64 32` |
   | `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` (your real domain, no trailing slash) |
   | `EMAIL_PROVIDER` | `resend` |
   | `RESEND_API_KEY` | from step 3 |
   | `CONTACT_RECEIVER_EMAIL` | where Contact form submissions should land |
   | `STORAGE_PROVIDER` | `supabase` |
   | `SUPABASE_URL` | from step 2 |
   | `SUPABASE_SERVICE_ROLE_KEY` | from step 2 |

4. Deploy. First deploy will fail if the database is empty — make sure
   step 2's `prisma db push` has been run first.

## 5. Point your domain at Vercel

1. Vercel project → Settings → Domains → add your domain.
2. Vercel shows the exact DNS record(s) to add (usually an `A` record for the
   root domain and/or a `CNAME` for `www`) — add those at your domain
   registrar's DNS settings.
3. DNS propagation can take a few minutes to a few hours. Vercel's Domains
   page shows a green check once it's verified and SSL is issued
   automatically.

## 6. Seed the admin account

The local dev DB was seeded with `scripts/seed.js` (admin login
`admin@nepalicommunity.uk` / `AdminPass123!`). Run the same script once
against production (with `DATABASE_URL`/`DIRECT_DATABASE_URL` pointed at
Supabase) — **then change that password immediately** by logging in and
updating it, since it's a well-known dev credential.

## After going live

- Local `prisma dev` limitations (max pool size 1, `experimental.cpus: 1` in
  `next.config.ts`) were needed only because of the fragile local dev
  database — real Postgres on Supabase doesn't have that problem. These can
  be relaxed later if build/query performance matters, but they're harmless
  to leave as-is.
- Switch `prisma db push` to proper `prisma migrate dev`/`deploy` once this
  is the long-term production database, so schema changes are tracked as
  reviewable migration files instead of applied ad-hoc.
