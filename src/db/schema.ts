import { pgSchema, serial, varchar, text, timestamp, boolean, doublePrecision, integer, index } from 'drizzle-orm/pg-core';

// This schema is deliberately not exposed through Supabase's browser Data API.
export const goldSchema = pgSchema('gold_app');
const dateTime = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' });

export const articles = goldSchema.table('articles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  metaDescription: varchar('meta_description', { length: 255 }),
  category: varchar('category', { length: 100 }).default('general'),
  publishedAt: dateTime('published_at').defaultNow(),
  updatedAt: dateTime('updated_at'),
  isPublished: boolean('is_published').default(false),
  showPrices: boolean('show_prices').default(false),
  price24: doublePrecision('price_24'),
  price21: doublePrecision('price_21'),
  price18: doublePrecision('price_18'),
  price14: doublePrecision('price_14'),
  priceGoldPound: doublePrecision('price_gold_pound'),
}, table => [index('articles_published_idx').on(table.isPublished, table.publishedAt)]).enableRLS();

export const priceHistory = goldSchema.table('price_history', {
  id: serial('id').primaryKey(),
  karat24: doublePrecision('karat_24'),
  karat21: doublePrecision('karat_21'),
  karat18: doublePrecision('karat_18'),
  ounceUSD: doublePrecision('ounce_usd'),
  timestamp: dateTime('timestamp').defaultNow(),
}, table => [index('price_history_timestamp_idx').on(table.timestamp)]).enableRLS();

export const settings = goldSchema.table('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: varchar('value', { length: 255 }).notNull(),
  updatedAt: dateTime('updated_at').defaultNow(),
}).enableRLS();

// Durable across serverless instances; one counter per IP per 15-minute window.
export const loginAttempts = goldSchema.table('login_attempts', {
  key: varchar('key', { length: 64 }).primaryKey(),
  attempts: integer('attempts').notNull().default(1),
  expiresAt: dateTime('expires_at').notNull(),
}, table => [index('login_attempts_expiry_idx').on(table.expiresAt)]).enableRLS();
