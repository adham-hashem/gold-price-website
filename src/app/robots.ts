import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
export default function robots(): MetadataRoute.Robots {
  const preview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  return { rules: { userAgent: '*', allow: preview ? undefined : '/', disallow: preview ? '/' : ['/admin/', '/api/'] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
