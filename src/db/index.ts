import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { runtimeConnectionConfig } from './connection';

// Reuse one small client per warm Vercel instance. No connections during build.
let database: ReturnType<typeof createDatabase> | undefined;
function createDatabase() {
  const { url, options } = runtimeConnectionConfig();
  const client = postgres(url, options);
  return drizzle(client, { schema });
}
export function getDb() { return database ??= createDatabase(); }
