import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { and, eq, lt } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import { incrementLoginAttempt, saveSetting, updateArticle } from '../src/db/operations';
import { runtimeConnectionConfig } from '../src/db/connection';



test('Supabase runtime uses verified TLS and transaction-pooler-safe settings', () => {
  const env = { DATABASE_URL: 'postgresql://postgres.test:encoded%40password@pooler.example.test:6543/postgres?sslmode=require', DATABASE_CA_CERT: 'line1\\nline2' };
  const { options } = runtimeConnectionConfig(env);
  assert.equal(options.max, 1);
  assert.equal(options.prepare, false);
  assert.equal(options.max_pipeline, 1);
  assert.equal(options.ssl.rejectUnauthorized, true);
  assert.equal(options.ssl.ca, 'line1\nline2');
  assert.throws(() => runtimeConnectionConfig({}), /DATABASE_URL/);
  assert.throws(() => runtimeConnectionConfig({ DATABASE_URL:'mysql://user:secret@localhost/database' }), /PostgreSQL/);
});

test('PostgreSQL migration, storage operations and RLS', async t => {
  const client = new PGlite();
  await client.waitReady;
  const db = drizzle(client, { schema });
  try {
    const migration = await readFile('drizzle/0000_supabase.sql', 'utf8');
    await client.exec(migration);

    await t.test('migration creates four private tables with RLS enabled', async () => {
      const { rows } = await client.query<{ name:string; rls:boolean }>(`SELECT c.relname AS name, c.relrowsecurity AS rls FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'gold_app' AND c.relkind = 'r' ORDER BY c.relname`);
      assert.deepEqual(rows.map(r => r.name), ['articles','login_attempts','price_history','settings']);
      assert.ok(rows.every(r => r.rls));
      await client.exec('CREATE ROLE gold_app_untrusted;');
      const { rows: grants } = await client.query<{ allowed:boolean }>(`SELECT has_schema_privilege('gold_app_untrusted', 'gold_app', 'USAGE') AS allowed`);
      assert.equal(grants[0].allowed, false);
    });

    await t.test('articles retain numeric prices, publication dates and unique URLs when edited', async () => {
      const publishedAt = new Date('2026-01-01T12:00:00Z');
      const [article] = await db.insert(schema.articles).values({ title:'Original article', slug:'gold-today', content:'An original gold market article.', publishedAt, isPublished:true, price21:4000.5 }).returning();
      assert.equal(article.price21,4000.5);
      assert.equal(article.publishedAt?.toISOString(),publishedAt.toISOString());
      await updateArticle(db,article.id,{ title:'Updated article' });
      const [updated] = await db.select().from(schema.articles).where(eq(schema.articles.id,article.id));
      assert.equal(updated.slug,'gold-today');
      assert.equal(updated.title,'Updated article');
      assert.equal(updated.publishedAt?.toISOString(),publishedAt.toISOString());
      assert.ok(updated.updatedAt instanceof Date);
      await assert.rejects(db.insert(schema.articles).values({ title:'Duplicate',slug:'gold-today',content:'Duplicate URL' }), error => (error as { cause?:{code?:string} }).cause?.code === '23505');
      await db.insert(schema.articles).values({ title:'Draft',slug:'draft',content:'Private unpublished content' });
      const rows = await db.select().from(schema.articles).where(and(eq(schema.articles.slug,'draft'),eq(schema.articles.isPublished,true)));
      assert.equal(rows.length,0);
    });

    await t.test('setting upserts keep one row and record edit time', async () => {
      await saveSetting(db,'usd-egp-rate','50');
      await saveSetting(db,'usd-egp-rate','52');
      const rows = await db.select().from(schema.settings).where(eq(schema.settings.key,'usd-egp-rate'));
      assert.equal(rows.length,1);
      assert.equal(rows[0].value,'52');
      assert.ok(rows[0].updatedAt instanceof Date);
    });

    await t.test('concurrent login attempts increment atomically and expired counters can be removed', async () => {
      const expiresAt = new Date(Date.now()+900000);
      const counts = await Promise.all(Array.from({length:15},()=>incrementLoginAttempt(db,'same-client-window',expiresAt)));
      assert.deepEqual(counts.sort((a,b)=>a-b),Array.from({length:15},(_,i)=>i+1));
      const [row] = await db.select().from(schema.loginAttempts).where(eq(schema.loginAttempts.key,'same-client-window'));
      assert.equal(row.attempts,15);
      await incrementLoginAttempt(db,'expired-window',new Date(0));
      await db.delete(schema.loginAttempts).where(lt(schema.loginAttempts.expiresAt,new Date()));
      const expired = await db.select().from(schema.loginAttempts).where(eq(schema.loginAttempts.key,'expired-window'));
      assert.equal(expired.length,0);
    });

    await t.test('history preserves numeric values and timestamps', async () => {
      const timestamp = new Date('2026-01-02T03:00:00Z');
      const [row] = await db.insert(schema.priceHistory).values({ karat24:5000,karat21:4375,karat18:3750,ounceUSD:3000.25,timestamp }).returning();
      assert.equal(row.ounceUSD,3000.25);
      assert.equal(row.timestamp?.toISOString(),timestamp.toISOString());
    });

    await t.test('ordinary roles cannot read private data or write login counters even if granted table privileges', async () => {
      await client.exec(`GRANT USAGE ON SCHEMA gold_app TO gold_app_untrusted; GRANT SELECT ON ALL TABLES IN SCHEMA gold_app TO gold_app_untrusted; GRANT INSERT ON gold_app.login_attempts TO gold_app_untrusted; SET ROLE gold_app_untrusted;`);
      try {
        const { rows } = await client.query('SELECT * FROM gold_app.articles');
        assert.equal(rows.length,0);
        const attempts = await client.query('SELECT * FROM gold_app.login_attempts');
        assert.equal(attempts.rows.length,0);
        await assert.rejects(client.query(`INSERT INTO gold_app.login_attempts (key, expires_at) VALUES ('forged', now())`), error => (error as {code?:string}).code === '42501');
      } finally { await client.exec('RESET ROLE;'); }
    });
  } finally { await client.close(); }
});
