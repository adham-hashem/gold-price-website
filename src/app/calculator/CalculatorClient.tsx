'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calculator, RefreshCw, ArrowUpLeft, Info } from 'lucide-react';
import { calculateGoldValue, formatPrice, formatTime, type GoldPrices } from '@/lib/goldService';
import { useGoldQuote } from '@/lib/hooks/useGoldQuote';
export default function CalculatorClient({ initialPrices }: { initialPrices: GoldPrices | null }) {
  const { prices, busy, error, refresh } = useGoldQuote(initialPrices);
  const [weight, setWeight] = useState('8');
  const [karat, setKarat] = useState(21);
  const [work, setWork] = useState('100');
  const grams = Math.max(0, Math.min(1e6, Number(weight) || 0));
  const fee = Math.max(0, Math.min(1e6, Number(work) || 0));
  const result = prices ? calculateGoldValue(grams, karat, prices.karat24, fee) : null;
  return <div className="container page-content"><div className="tool-header"><span className="section-kicker">أداة المقارنة</span><h1>حاسبة الذهب والمصنعية</h1><p>اعرف القيمة التقديرية قبل زيارة الصاغة. أدخل وزن القطعة ومصنعية الجرام.</p></div>
    <div className="calculation-layout"><section className="card calculation-form"><div className="form-group"><label className="form-label" htmlFor="gold-weight">الوزن بالجرام</label><input id="gold-weight" className="form-input" type="number" min="0" max="1000000" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} inputMode="decimal" /></div><fieldset className="karat-fieldset"><legend className="form-label">عيار الذهب</legend><div className="karat-selector">{[24,22,21,18,14].map(k => <button key={k} className={`karat-btn ${karat === k ? 'selected' : ''}`} onClick={() => setKarat(k)} aria-pressed={karat === k}>{k}K</button>)}</div></fieldset><div className="form-group"><label className="form-label" htmlFor="gold-workmanship">المصنعية لكل جرام بالجنيه</label><input id="gold-workmanship" className="form-input" type="number" min="0" max="1000000" step="1" value={work} onChange={e => setWork(e.target.value)} inputMode="decimal" /><p className="field-hint">أدخل المصنعية التي عرضها عليك التاجر؛ لا توجد مصنعية موحدة لكل القطع.</p></div><button className="button button-outline" onClick={refresh} disabled={busy}><RefreshCw size={15} className={busy ? 'is-spinning' : ''} />{busy ? 'جارٍ التحديث' : 'تحديث سعر الذهب'}</button></section>
    <section className="calculation-result" aria-label="نتيجة الحساب"><Calculator size={30} /><span className="section-kicker">القيمة الإجمالية التقديرية</span><strong>{result ? formatPrice(result.totalValue) : '—'} <small>ج.م</small></strong>{result && prices ? <><div className="calculation-line"><span>قيمة الذهب الخام</span><b>{formatPrice(result.goldValue)} ج.م</b></div><div className="calculation-line"><span>المصنعية · {formatPrice(grams)} جرام</span><b>{formatPrice(result.craftsmanshipCost)} ج.م</b></div><div className="calculation-line"><span>سعر جرام عيار {karat}</span><b>{formatPrice(prices.karat24 * karat / 24)} ج.م</b></div><p>آخر جلب للأسعار: {formatTime(prices.lastUpdated)} بتوقيت القاهرة</p></> : <p>تظهر النتيجة عند وصول سعر مؤكد من المصدر.</p>}{error && <p role="status">{error}</p>}<div className="calculation-disclaimer"><Info size={16} /> لا يشمل الضرائب أو الرسوم الإضافية. السعر الفعلي يحدده التاجر.</div></section></div>
    <div className="card tool-explanation"><h2>كيف تحسب تكلفة قطعة الذهب؟</h2><p>قيمة الذهب الخام = الوزن × سعر جرام العيار. المصنعية = الوزن × مصنعية الجرام. الإجمالي هو مجموعهما قبل الضرائب والرسوم. يعتمد التقدير على سعر عيار ٢٤ المقرب بالجنيه، لذلك قد تختلف النتيجة قليلاً عن الحسابات غير المقربة.</p><Link className="text-link" href="/methodology/">راجع طريقة حساب الأسعار <ArrowUpLeft size={16} /></Link></div>
  </div>;
}
