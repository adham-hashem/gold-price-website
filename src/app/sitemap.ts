import { MetadataRoute } from 'next';
import { fetchArticles } from '@/lib/articleService';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.egyptgold.online';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic articles for the sitemap
  const articles = await fetchArticles();
  
  const articleUrls = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}/`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/calculator/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/converter/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/disclaimer/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...articleUrls];
}
