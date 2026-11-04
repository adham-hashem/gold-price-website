'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpLeft, RefreshCw, Clock3, ShieldCheck, Calculator, Repeat2, ArrowLeft, Globe2, Coins, Scale, Info } from 'lucide-react';
import { GoldPrices, fetchGoldPrices, formatPrice, formatDate, formatTime } from '@/lib/goldService';
import type { Article } from '@/lib/articleService';
import ArticleCard from '@/components/ArticleCard';
import { faqs } from '@/lib/site';

export default function HomeClient({ initialPrices, latestArticles }: { initialPrices: GoldPrices | null; latestArticles: Article[] }) {
  const [prices, setPrices] = useState(initialPrices);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialPrices ? '' : 'تعذر جلب الأسعار من المصدر حالياً. يمكنك إعادة المحاولة.');
  const [countdown, setCountdown] = useState(60);
  const [now, setNow] = useState<number | null>(null);
  const load = useCallback(async () => {
    setBusy(true);
    try { setPrices(await fetchGoldPrices()); setError(''); }
    catch { setError('تعذر تحديث الأسعار. تأكد من وقت آخر تحديث قبل استخدامها.'); }
    finally { setBusy(false); setCountdown(60); }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => { if (document.visibilityState === 'visible') void load(); }, 60000);
    const clock = setInterval(() => { setCountdown(v => Math.max(0, v - 1)); setNow(Date.now()); }, 1000);
    return () => { clearInterval(interval); clearInterval(clock); };
  }, [load]);
  const stale = prices && now !== null && now - new Date(prices.lastUpdated).getTime() > 5 * 60 * 1000;
  const quote = stale ? null : prices;
  const karats = quote ? [24, 22, 21, 18, 14].map(karat => ({ karat, price: quote[`karat${karat}` as 'karat24' | 'karat22' | 'karat21' | 'karat18' | 'karat14'] })) : [];
  return <div className="market-home">
    <section className="market-hero"><div className="container hero-layout"><div className="hero-copy">
      <div className="eyebrow"><span className="status-dot" /> نافذتك على سوق الذهب</div>
      <h1>أسعار الذهب اليوم<br />في مصر<span className="hero-dot">.</span></h1>
      <p>تابع قيمة الذهب بوضوح. اعرف سعر الجرام، قارن العيارات، واحسب قيمة مشترياتك قبل زيارة الصاغة.</p>
      <div className="hero-actions"><Link className="button button-gold" href="#today-prices">اكتشف أسعار اليوم <ArrowLeft size={18} /></Link><Link className="hero-text-link" href="/calculator/">احسب قيمة ذهبك <ArrowUpLeft size={18} /></Link></div>
      <div className="hero-proof"><span><ShieldCheck size={16} /> مصادر معلنة</span><span><Clock3 size={16} /> تحديث كل دقيقة</span><span>EGP · جنيه مصري</span></div>
    </div><div className="hero-visual"><div className="gold-orbit" aria-hidden="true"><div className="gold-ingot ingot-back"><span>FINE GOLD</span><b>999.9</b></div><div className="gold-ingot ingot-front"><span>EGYPT GOLD</span><b>Au</b><small>PURE VALUE</small></div></div>
      <div className="hero-quote"><div><span>سعر الجرام · عيار ٢١</span><small>قيمة تقديرية بدون مصنعية</small></div><strong>{quote ? formatPrice(quote.karat21) : '—'}<small>ج.م</small></strong></div>
    </div></div><div className="hero-bottom"><div className="container"><span>متابعة السوق، ببساطة.</span><span>عيار ٢٤ <i /> عيار ٢١ <i /> عيار ١٨ <i /> الجنيه الذهب</span></div></div></section>

    <div className="container market-content"><section id="today-prices" className="today-section">
      <div className="section-heading"><div><span className="section-kicker">نظرة على السوق</span><h2>كل الأسعار. في لمحة.</h2><p>سعر جرام الذهب بالجنيه المصري، قبل المصنعية والضرائب.</p></div><button className="button button-outline" onClick={load} disabled={busy}><RefreshCw size={16} className={busy ? 'is-spinning' : ''} /> {busy ? 'جارٍ التحديث' : 'تحديث الأسعار'}</button></div>
      {(error || stale) && <div className="price-alert" role="status"><Info size={18} /><span>{stale ? 'الأسعار السابقة قديمة؛ أُخفيت لحين جلب تحديث جديد.' : error}</span></div>}
      <div className="market-grid"><div className="price-table-card"><div className="table-caption"><span><span className="status-dot" /> {quote ? 'آخر أسعار متاحة' : 'بانتظار تحديث المصدر'}</span><span>السعر لكل جرام</span></div><table className="market-price-table"><caption className="sr-only">أسعار الذهب اليوم في مصر لجميع العيارات</caption><thead><tr><th scope="col">عيار الذهب</th><th scope="col">نسبة النقاء</th><th scope="col">السعر بالجنيه</th></tr></thead><tbody>{karats.length ? karats.map(({ karat, price }) => <tr className={karat === 21 ? 'featured-row' : ''} key={karat}><th scope="row"><span className="karat-tile">{karat}<small>K</small></span><span>ذهب عيار {karat}{karat === 21 && <small className="popular-tag">الأكثر متابعة</small>}</span></th><td>{(karat / 24 * 100).toFixed(1)}٪</td><td><strong>{formatPrice(price)}</strong> <span>ج.م</span></td></tr>) : <tr><td colSpan={3} className="empty-quotes">لا توجد أسعار مؤكدة من المصدر الآن.<br /><button onClick={load} className="text-button" disabled={busy}>إعادة المحاولة</button></td></tr>}</tbody></table><div className="quote-timestamp"><Clock3 size={14} /><span>{prices ? `آخر جلب ناجح: ${formatDate(prices.lastUpdated)}، ${formatTime(prices.lastUpdated)} بتوقيت القاهرة` : 'نُظهر الأسعار فقط عند وصول بيانات من المصدر.'}</span><span>التحديث بعد {countdown} ث</span></div></div>
      <aside className="market-side"><div className="gold-pound-card"><div className="metric-icon"><Coins size={25} /></div><span>الجنيه الذهب</span><strong>{quote ? formatPrice(quote.goldPound) : '—'} <small>ج.م</small></strong><p>٨ جرامات · عيار ٢١ · بدون مصنعية</p><Link href="/calculator/">احسب قيمة وزن آخر <ArrowUpLeft size={17} /></Link></div><div className="market-method"><ShieldCheck size={23} /><h3>اعرف مصدر الرقم</h3><p>تقدير محسوب من الأونصة العالمية وسعر الصرف، مع تعديل للسوق. سعر المحل النهائي قد يختلف.</p><Link href="/methodology/">كيف نحسب الأسعار؟ <ArrowLeft size={15} /></Link></div></aside></div>
      <div className="global-metrics"><div><Globe2 /><span>الأونصة عالمياً<strong>{quote ? `$${formatPrice(quote.ounceUSD)}` : '—'}</strong></span><small>دولار أمريكي</small></div><div><Scale /><span>الأونصة بالجنيه<strong>{quote ? formatPrice(quote.ounceEGP) : '—'}</strong></span><small>٣١٫١٠٣٥ جرام</small></div><div><Repeat2 /><span>سعر الصرف المستخدم<strong>{quote ? formatPrice(quote.bankRate) : '—'}</strong></span><small>جنيه / دولار</small></div></div>
    </section>

    <section className="tools-section"><div className="section-heading"><div><span className="section-kicker">خطوتك التالية</span><h2>أرقام تساعدك على المقارنة.</h2></div><span className="muted-label">أدوات مجانية وسهلة الاستخدام</span></div><div className="tools-pair"><Link href="/calculator/" className="utility-card"><span className="utility-icon"><Calculator size={28} /></span><div><h3>حاسبة الذهب والمصنعية</h3><p>أدخل الوزن والعيار والمصنعية، واعرف القيمة التقديرية لقطعتك.</p><span>ابدأ الحساب <ArrowUpLeft size={18} /></span></div><b aria-hidden="true">01</b></Link><Link href="/converter/" className="utility-card"><span className="utility-icon"><Repeat2 size={28} /></span><div><h3>محوّل عيارات الذهب</h3><p>قارن الوزن المكافئ بين العيارات مع الحفاظ على كمية الذهب الخالص.</p><span>حوّل العيار <ArrowUpLeft size={18} /></span></div><b aria-hidden="true">02</b></Link></div></section>

    {latestArticles.length > 0 && <section className="news-section"><div className="section-heading"><div><span className="section-kicker">اقرأ وافهم</span><h2>من دفتر الذهب.</h2></div><Link href="/articles/" className="text-link">كل المقالات <ArrowLeft size={18} /></Link></div><div className="news-grid">{latestArticles.map(a => <ArticleCard key={a.id} article={a} />)}</div></section>}

    <section className="faq-layout"><div><span className="section-kicker">المعرفة تصنع الفرق</span><h2>قبل أن تسأل<br />محل الصاغة.</h2><p>إجابات واضحة على أسئلة متابعة الذهب وقراءة أسعاره.</p><Link href="/methodology/" className="text-link">دليل مصادر الأسعار <ArrowUpLeft size={18} /></Link></div><div>{faqs.map(f => <details className="market-faq" key={f.question}><summary>{f.question}<span aria-hidden="true">+</span></summary><p>{f.answer}</p></details>)}</div></section>
    <div className="editorial-note"><Info size={20} /><p>المحتوى للتوعية والمقارنة، ولا يمثل توصية استثمارية أو سعراً ملزماً. راجع السعر الفعلي والمصنعية والضرائب مع التاجر قبل الشراء أو البيع.</p></div>
    </div>
  </div>;
}
