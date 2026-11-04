# Verification — Supabase version, 29 October 2026

- Production build: `npm run build` passed on Next.js 16.4.3 after replacing the MySQL adapter with Supabase PostgreSQL (`postgres` 3.4.9 and Drizzle ORM 0.45.4).
- TypeScript: standalone check and production-build type checking passed.
- Automated tests: **18 passed**, including the existing authentication, input validation, content safety and gold-calculation tests.
- PostgreSQL integration: an isolated PGlite engine successfully applied the checked-in migration. Tests verified the four private tables, row-level security, numeric price/date handling, article URL uniqueness and modification dates, setting upserts, concurrent atomic login counters, expiry cleanup, price history, and denial of reads/writes by an ordinary role even after table privileges were granted.
- Connection configuration: tests verify the small client pool, disabled prepared statements/pipelining, enabled TLS certificate verification, certificate decoding and rejection of missing/non-PostgreSQL connection strings.
- Migration history: `drizzle-kit check` passed. Schema generation and database tests were offline; no live database was changed.
- Production HTTP smoke test: 13 public routes passed, including admin, robots, manifest and the PNG social image. API authorization, same-origin checks, cron protection and real 404 behavior passed. Article/settings/history APIs returned safe 503 responses without a configured Supabase connection.
- Security audit: `npm audit --omit=dev` reported zero known production vulnerabilities. `npm ls` confirmed `postgres` is installed and the direct MySQL driver is removed. This is a point-in-time dependency check.
- The earlier desktop/mobile redesign and its browser checks are unchanged by this database migration.

## Live-service limits

No Supabase connection strings or project access were supplied. A real Supabase project has not been created or connected, and its project settings, network/TLS connection, production admin login, article publishing, sitemap and scheduled snapshots have not been verified against live Supabase. Configure the server-only `DATABASE_URL`, use `DIRECT_URL` locally to run `npm run db:migrate`, then verify those workflows as described in README.md.

No previous MySQL records were transferred or deleted. Existing content remains in the old database and requires a separate data transfer if needed. No Vercel deployment was created. The original `backend/` and `gold-prices-app/` folders remain unchanged. Generated local caches and temporary test artifacts are excluded from Git/Vercel uploads.
