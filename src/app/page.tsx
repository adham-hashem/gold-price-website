import { fetchGoldPrices } from '@/lib/goldService';
import { fetchArticles } from '@/lib/articleService';
import HomeClient from './HomeClient';

export default async function HomePage() {
  // SSR: Fetch data on the server
  const initialPrices = await fetchGoldPrices().catch(() => null);
  const articles = await fetchArticles().catch(() => []);
  const latestArticles = articles.slice(0, 3); // Show top 3

  return (
    <HomeClient 
      initialPrices={initialPrices} 
      latestArticles={latestArticles} 
    />
  );
}
