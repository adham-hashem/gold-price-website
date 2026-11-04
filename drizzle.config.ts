import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { databaseTls } from './src/db/connection';
config({ path: '.env.local' });
config();
// Migrations use a direct or session-pooler URL, never the transaction pooler.
const url = process.env.DIRECT_URL;
export default defineConfig({
  schema: './src/db/schema.ts', out: './drizzle', dialect: 'postgresql',
  schemaFilter: ['gold_app'],
  ...(url ? { dbCredentials: { url, ssl: databaseTls() } } : {}),
});
