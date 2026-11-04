import { eq, sql } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import * as schema from './schema';

// Shared by the API and PostgreSQL integration tests.
export async function incrementLoginAttempt<T extends PgQueryResultHKT>(db: PgDatabase<T, typeof schema>, key: string, expiresAt: Date) {
  const [row] = await db.insert(schema.loginAttempts).values({ key, attempts: 1, expiresAt })
    .onConflictDoUpdate({ target: schema.loginAttempts.key, set: { attempts: sql`${schema.loginAttempts.attempts} + 1` } })
    .returning({ attempts: schema.loginAttempts.attempts });
  return row.attempts;
}

export async function saveSetting<T extends PgQueryResultHKT>(db: PgDatabase<T, typeof schema>, key: string, value: string) {
  await db.insert(schema.settings).values({ key, value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value, updatedAt: new Date() } });
}

export async function updateArticle<T extends PgQueryResultHKT>(db: PgDatabase<T, typeof schema>, id: number, values: Partial<typeof schema.articles.$inferInsert>) {
  return db.update(schema.articles).set({ ...values, updatedAt: new Date() }).where(eq(schema.articles.id, id)).returning({ id: schema.articles.id });
}
