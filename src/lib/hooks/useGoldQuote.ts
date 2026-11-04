'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchGoldPrices, type GoldPrices } from '@/lib/goldService';
export function useGoldQuote(initial: GoldPrices | null) {
  const [prices, setPrices] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initial ? '' : 'الأسعار غير متاحة من المصدر حالياً.');
  const refresh = useCallback(async () => {
    setBusy(true);
    try { setPrices(await fetchGoldPrices()); setError(''); }
    catch { setError('تعذر تحديث الأسعار من المصدر. تحقق من آخر وقت تحديث.'); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => { if (document.visibilityState === 'visible') void refresh(); }, 60000);
    const stale = setInterval(() => setPrices(p => p && Date.now() - new Date(p.lastUpdated).getTime() > 300000 ? null : p), 10000);
    return () => { clearInterval(interval); clearInterval(stale); };
  }, [refresh]);
  return { prices, busy, error, refresh };
}
