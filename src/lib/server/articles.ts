import { and, desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { getDb } from '@/db';
import { articles } from '@/db/schema';
import type { Article } from '@/lib/articleService';
import { cleanContent } from './content';

function serialize(row: typeof articles.$inferSelect): Article {
  return { ...row, content: cleanContent(row.content),
    publishedAt: row.publishedAt?.toISOString() || '',
    updatedAt: row.updatedAt?.toISOString() || null,
    isPublished: Boolean(row.isPublished), showPrices: Boolean(row.showPrices) };
}
export const fetchArticles = cache(async (): Promise<Article[]> => {
  const rows = await getDb().select().from(articles).where(eq(articles.isPublished, true)).orderBy(desc(articles.publishedAt));
  return rows.map(serialize);
});
export const fetchArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const rows = await getDb().select().from(articles).where(and(eq(articles.slug, slug), eq(articles.isPublished, true))).limit(1);
  return rows[0] ? serialize(rows[0]) : null;
});
