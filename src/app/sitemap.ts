import type { MetadataRoute } from 'next';
import { fetchArticles } from '@/lib/server/articles';
import { SITE_URL } from '@/lib/site';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await fetchArticles();
  const routes = ['', 'articles', 'calculator', 'converter', 'methodology', 'about', 'contact', 'privacy-policy', 'terms', 'disclaimer'];
  return [
    ...routes.map(route => ({ url: `${SITE_URL}/${route ? route + '/' : ''}`, changeFrequency: route === '' || route === 'articles' ? 'daily' as const : 'monthly' as const, priority: route === '' ? 1 : 0.6 })),
    ...articles.map(article => ({ url: `${SITE_URL}/articles/${encodeURIComponent(article.slug)}/`, ...(article.updatedAt || article.publishedAt ? { lastModified: new Date(article.updatedAt || article.publishedAt) } : {}), changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
