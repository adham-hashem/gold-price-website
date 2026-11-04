import { unstable_cache } from 'next/cache';
import { getDb } from '@/db';
import { settings } from '@/db/schema';
import type { GoldPrices } from '@/lib/goldService';

async function readJson(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(7000), cache: 'no-store' });
  if (!response.ok) throw new Error('Price provider unavailable');
  return response.json();
}
export function derivePrices(ounceUSD: number, bankRate: number, gap: number, markup: number, retrievedAt: Date): GoldPrices {
  if (![ounceUSD, bankRate, markup, bankRate + gap].every(n => Number.isFinite(n) && n > 0)) throw new Error('Invalid source prices');
  const effectiveRate = bankRate + gap;
  const gram24 = ounceUSD * effectiveRate / 31.1034768 * markup;
  return {
    karat24: Math.round(gram24), karat22: Math.round(gram24 * 22 / 24),
    karat21: Math.round(gram24 * 21 / 24), karat18: Math.round(gram24 * 18 / 24),
    karat14: Math.round(gram24 * 14 / 24), goldPound: Math.round(gram24 * 21 / 24 * 8),
    ounceUSD, ounceEGP: Math.round(ounceUSD * effectiveRate),
    bankRate, usdToEgp: effectiveRate, lastUpdated: retrievedAt,
    change24h: null, changePercent24h: null,
  };
}
const readQuote = unstable_cache(async () => {
  // Preserve configured market adjustments: do not silently discard them on a DB outage.
  const stored = await getDb().select().from(settings);
  const [gold, fx] = await Promise.all([
    readJson('https://api.gold-api.com/price/XAU'),
    readJson('https://api.exchangerate-api.com/v4/latest/USD').catch(() => null),
  ]);
  const manual = stored.find(s => s.key === 'usd-egp-rate')?.value;
  const bankRate = Number(manual || fx?.rates?.EGP);
  const gap = Number(stored.find(s => s.key === 'ounce-offset')?.value || 0);
  const quote = derivePrices(Number(gold.price), bankRate, gap, Number(process.env.MARKET_MARKUP || 1.015), new Date());
  return { ...quote, lastUpdated: new Date(quote.lastUpdated).toISOString() };
}, ['gold-quote-v1'], { revalidate: 60, tags: ['gold-quote'] });

export async function fetchServerPrices(): Promise<GoldPrices> {
  const quote = await readQuote();
  if (Date.now() - new Date(quote.lastUpdated).getTime() > 5 * 60 * 1000) throw new Error('Quote is stale');
  return { ...quote, lastUpdated: new Date(quote.lastUpdated) };
}
