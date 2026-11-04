export interface GoldPrices {
  karat24: number; karat22: number; karat21: number; karat18: number; karat14: number;
  ounceUSD: number; ounceEGP: number; usdToEgp: number; bankRate: number; goldPound: number;
  lastUpdated: Date; change24h: number | null; changePercent24h: number | null;
}
export interface CraftsmanshipEstimate { karat: number; minPerGram: number; maxPerGram: number }
export async function fetchGoldPrices(): Promise<GoldPrices> {
  const res = await fetch('/api/prices/', { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error('تعذر تحديث الأسعار حالياً');
  const data = await res.json();
  return { ...data, lastUpdated: new Date(data.lastUpdated) };
}
export async function fetchPriceHistory() {
  const res = await fetch('/api/price-history/', { cache: 'no-store' });
  return res.ok ? res.json() : [];
}
export function getCraftsmanshipEstimates(): CraftsmanshipEstimate[] {
  return [24, 22, 21, 18, 14].map(karat => ({ karat, minPerGram: karat === 18 ? 50 : 30, maxPerGram: karat === 18 ? 150 : 120 }));
}
export function calculateGoldValue(weight: number, karat: number, gram24: number, craftsmanship = 0) {
  if (![weight, gram24, craftsmanship].every(n => Number.isFinite(n) && n >= 0) || !Number.isFinite(karat) || karat <= 0 || karat > 24) throw new Error('Invalid gold calculation');
  const goldValue = weight * gram24 * karat / 24;
  const craftsmanshipCost = weight * craftsmanship;
  return { goldValue: Math.round(goldValue), craftsmanshipCost: Math.round(craftsmanshipCost), totalValue: Math.round(goldValue + craftsmanshipCost) };
}
export function convertKarat(weight: number, from: number, to: number) {
  if (!Number.isFinite(weight) || weight < 0 || ![from, to].every(n => Number.isFinite(n) && n > 0 && n <= 24)) throw new Error('Invalid karat conversion');
  return Math.round(weight * from / to * 1000) / 1000;
}
export function formatPrice(value: number) { return value.toLocaleString('ar-EG', { maximumFractionDigits: 2 }); }
export function formatTime(date: Date | string) { return new Date(date).toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' }); }
export function formatDate(date: Date | string) { return new Date(date).toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo', year: 'numeric', month: 'long', day: 'numeric' }); }
