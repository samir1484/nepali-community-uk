# Nepali Community UK

Phase 1: project foundation — auth, branding, and core pages. See `.env.example` for
required environment variables.

## Local development

This machine doesn't have Docker, so local Postgres is provided by Prisma's own
built-in dev database instead of `docker-compose`.

1. Start the local database (run once per reboot; it stays running in the background):
   ```bash
   npx prisma dev -d --name nepali-community-uk
   ```
   Copy the printed connection string into `DATABASE_URL` in `.env` if it's not already
   set (see `npx prisma dev ls` to see the current server's URL again later).

2. Start Mailpit (dev email inbox) if it isn't already running as a background service:
   ```bash
   mailpit
   ```
   View sent emails at http://localhost:8025.

3. Apply the Prisma schema to the database:
   ```bash
   npx prisma db push
   ```
   (`db push` is used instead of `migrate dev` for now — the local Prisma dev database
   doesn't yet support the shadow-database reset step `migrate dev` relies on. Switch to
   `migrate dev` once `DATABASE_URL` points at a real Postgres instance, e.g. Supabase.)

4. Seed an admin account and the homepage's starter content:
   ```bash
   node scripts/seed.js
   ```
   Creates `admin@nepalicommunity.uk` / `AdminPass123!` (dev-only — change this
   before any real deployment) and, on first run, seeds the highlight cards and
   photo showcase panels shown on the homepage.

5. Run the app:
   ```bash
   npm run dev
   ```

## Admin panel

Log in as the seeded admin account, then visit `/admin`. From **Homepage Sections**
you can add, edit, delete, and reorder the small feature cards ("Highlight") and the
full-bleed photo panels ("Showcase") shown on the homepage, including uploading new
photos directly (stored under `public/uploads`, served at `/uploads/...`). Access is
gated by `role` (`ADMIN`/`MODERATOR`) both in `src/proxy.ts` and again in
`src/app/(admin)/admin/layout.tsx`.

## Going to production

- Point `DATABASE_URL` at a real Postgres instance (e.g. a Supabase project) and run
  `npx prisma migrate deploy`.
- Set `EMAIL_PROVIDER=resend` and `RESEND_API_KEY` to send real email.
- Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` to enable Google sign-in.
- Set a strong `NEXTAUTH_SECRET`.
