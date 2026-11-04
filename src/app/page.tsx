import { fetchServerPrices } from '@/lib/server/prices';
import { fetchArticles } from '@/lib/server/articles';
import { faqs } from '@/lib/site';
import { jsonLd } from '@/lib/server/content';
import HomeClient from './HomeClient';
export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const [prices, articles] = await Promise.all([fetchServerPrices().catch(() => null), fetchArticles().catch(() => [])]);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) }) }} /><HomeClient initialPrices={prices} latestArticles={articles.slice(0, 3)} /></>;
}
