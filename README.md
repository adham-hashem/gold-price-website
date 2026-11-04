# Egypt Gold — Vercel + Supabase

Deploy this standalone folder. The original `backend/` and `gold-prices-app/` are unchanged. The frontend and backend run together in one Next.js Vercel project; **Supabase PostgreSQL** stores the data.

## Set up Supabase

1. Create a Supabase project and save its **database password**. Choose a region near your Vercel Functions.
2. In the Supabase Dashboard, open your project and click **Connect**.
3. Copy the **Transaction pooler** connection string (port **6543**) into the server-only `DATABASE_URL` variable. Copy the complete host and username from the dashboard; do not invent a pooler hostname. Replace the password placeholder with your actual database password, percent-encoding reserved URL characters such as `@`, `#`, `/`, and `?`.
4. For schema migrations on your PC, copy the **Direct connection** string (port **5432**) into `DIRECT_URL`. If your network cannot reach the direct IPv6 endpoint, use the **Session pooler** string on port **5432** instead. Do not use the transaction-pooler URL for migration commands.
5. Copy `.env.example` to `.env.local` in this folder and fill in both connection strings and the admin secrets. Keep this file private.
6. From this folder, install dependencies and apply the checked-in PostgreSQL migration:

   ```powershell
   npm ci
   npm run db:migrate
   ```

   This creates four tables in the private **`gold_app`** schema: `articles`, `settings`, `price_history`, and `login_attempts`. In Supabase's Table Editor, choose that schema to see the tables. Migration bookkeeping uses Drizzle's own schema. No demo articles or prices are inserted. Review the SQL under `drizzle/` and back up an existing project before applying changes.

### Database access and security

- All database access happens inside the Vercel backend. The browser calls the same-origin `/api/*` endpoints.
- **No Supabase anon key, service-role key, or browser database URL is required.** Never put `DATABASE_URL` or `DIRECT_URL` in a `NEXT_PUBLIC_*` variable.
- Use the dashboard's `postgres` database connection strings for this setup. The trusted server connects as the table-owning database role. A custom database role needs explicit grants and an appropriate RLS access design.
- `gold_app` is a private schema; do not add it to Supabase's Data API exposed schemas. All four tables also have **row-level security enabled with no public policies**, denying access to ordinary database roles. Public website content is filtered and served by the backend, rather than exposing tables directly.
- The runtime reuses one connection per warm instance, disables prepared statements and query pipelining for transaction pooling, and verifies TLS certificates. If Supabase requires a custom root certificate, download it from your project's Database settings and set `DATABASE_CA_CERT` to its PEM contents. Literal `\n` separators are supported; do not disable certificate verification.
- Article and setting modification times are managed by the application during edits. PostgreSQL has no MySQL-style automatic `ON UPDATE` column clause.

Official guidance: [Supabase connections and poolers](https://supabase.com/docs/guides/database/connecting-to-postgres), [Drizzle with Supabase](https://orm.drizzle.team/docs/connect-supabase), [Supabase database access](https://supabase.com/docs/guides/database/secure-data).

## Deploy to Vercel

1. Import the repository and select **Root Directory: `vercel-deploy`** (or `.` if this folder is its own repository).
2. Use **Next.js**, **Node.js 24.x**, install command `npm ci`, and build command `npm run build`. Leave the Output Directory at its framework default.
3. Add these **Production** environment variables:
   - `DATABASE_URL`: Supabase **transaction pooler**, port 6543
   - `DATABASE_CA_CERT`: optional custom root certificate, if needed
   - `ADMIN_PASSWORD`: unique password of at least 16 characters
   - `JWT_SECRET`: random signing secret of at least 32 characters
   - `CRON_SECRET`: separate random secret for the scheduled snapshot
   - `NEXT_PUBLIC_SITE_URL`: your final HTTPS domain without a trailing slash
   - Optional: `GOOGLE_SITE_VERIFICATION`, `MARKET_MARKUP` (default `1.015`)
4. `DIRECT_URL` is only needed where you run migration commands, normally your local `.env.local`. The Vercel runtime/build does not require it and does not automatically run migrations.
5. Apply `npm run db:migrate` against the intended Supabase project **before** testing the deployed site, then deploy. No separate Express/backend project is needed. Remove obsolete `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_SSL` variables from this Vercel project if you previously configured the MySQL version.
6. Attach your domain and make `NEXT_PUBLIC_SITE_URL` match its preferred canonical HTTPS hostname. For functional Preview deployments, configure a **separate Supabase project/database and credentials**. Previews are marked `noindex` and blocked in robots.txt.
7. Verify `/`, `/articles/`, `/calculator/`, `/converter/`, `/methodology/`, `/robots.txt`, `/sitemap.xml`, and `/opengraph-image`. Log in at `/admin/`, publish an article, edit it, verify the published page and sitemap, and remove the test article. Check Vercel Functions logs if an API returns 503.

Changing Vercel environment variables requires a redeployment to take effect. A Vercel build can succeed without database credentials; database features remain unavailable until the connection and schema are configured.

## Recover your admin login

**No username is needed. Supabase Auth accounts are not used for this admin login.** Open `/admin/` and enter the app's `ADMIN_PASSWORD`.

- **Original local website:** open `../backend/.env` locally and find `ADMIN_PASSWORD`. Do not share or commit that file. The old MySQL `admins` table was not used by the password-only login and is not needed in Supabase.
- **New Vercel deployment:** use the `ADMIN_PASSWORD` set in this Vercel project's environment variables. If forgotten, replace it with a new unique password of at least 16 characters and **redeploy**.
- **Local copy:** change `ADMIN_PASSWORD` in `.env.local` and restart `npm run dev`.
- Generate `JWT_SECRET` with:

  ```powershell
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

  Run again for `CRON_SECRET`. Use a password manager for your admin password. The **Supabase database password** belongs in the connection strings; it is separate from the **website's admin password**.

Rotating `ADMIN_PASSWORD` or `JWT_SECRET` invalidates existing sessions after restart/redeployment. Sessions last eight hours, using an HttpOnly, SameSite cookie (Secure in production). After ten login attempts from one IP in a 15-minute window, the API returns 429 until that window ends. The counter is atomically updated in Supabase so it works across Vercel instances. Missing database configuration/schema or missing/short app credentials fails closed with 503.

## Existing data from MySQL

This is a PostgreSQL schema migration for **new Supabase storage**, not an automatic transfer of your previous MySQL data. Existing MySQL articles, settings and history stay in the old database. No old data has been deleted or copied. Export/convert/import that data separately if you need to preserve it; a MySQL SQL dump cannot be run unchanged against PostgreSQL. Preserve article slugs and publication dates to retain existing URLs.

## Local development and future schema changes

```powershell
Copy-Item .env.example .env.local
# Fill in DATABASE_URL, DIRECT_URL and the app secrets, then:
npm ci
npm run db:migrate
npm run dev
```

For future schema changes: edit `src/db/schema.ts`, run `npm run db:generate`, review the generated SQL, then run `npm run db:migrate` against the intended database. Do not mix ad hoc schema pushes with the tracked migration history on the same database.

Checks: `npm test`, `npm run typecheck`, `npm run build`. Tests include an embedded PostgreSQL engine; they do not use or modify your live Supabase project. `node scripts/smoke.mjs http://localhost:3100` checks a running production server on that port.

## Prices, history and search

The server fetches Gold API's XAU quote and ExchangeRate-API's USD/EGP reference, caching results for 60 seconds. The homepage refreshes while visible. Quotes older than five minutes are hidden; there is no demo-price fallback or fabricated daily percentage change. A database outage does not silently discard saved market adjustments.

The `/methodology/` page explains the calculation. If you change `MARKET_MARKUP`, update that page to disclose the chosen multiplier and redeploy. Prices estimate raw gold value and exclude workmanship, taxes and dealer spreads.

`vercel.json` schedules `/api/cron/snapshot/` daily at **03:00 UTC**. Vercel authenticates with `CRON_SECRET`; without it the route rejects access. Successful snapshots are stored in Supabase. The chart needs at least two snapshots. It is daily history, not intraday trading data.

See [SEO-CHECKLIST.md](./SEO-CHECKLIST.md) for domain verification, sitemap submission and Google Search Console. Technical SEO cannot guarantee a top Google ranking or indexing.

## Advertising, fonts and privacy

AdSense only loads when `NEXT_PUBLIC_ADSENSE_PUB_ID` is set. Configure your own ad units and `public/ads.txt` before enabling ads. Verify that you own the inherited contact email before launch. Cairo fonts are self-hosted under the SIL Open Font License in `public/fonts/OFL.txt`. Vercel Analytics and Speed Insights remain integrated.
