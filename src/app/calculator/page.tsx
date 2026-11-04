import type { Metadata } from 'next';
import CalculatorClient from './CalculatorClient';
import { fetchServerPrices } from '@/lib/server/prices';
import { fetchHistory } from '@/lib/server/history';
import SimplePriceChart from '@/components/SimplePriceChart';
import { SITE_URL } from '@/lib/site';
import { jsonLd } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'حاسبة الذهب والمصنعية في مصر | احسب قيمة ذهبك', description: 'احسب قيمة الذهب حسب الوزن والعيار والمصنعية بالجنيه المصري. حاسبة تقديرية لعيارات ٢١ و١٨ و٢٤ مع توضيح مكونات السعر.', alternates: { canonical: '/calculator/' }, openGraph: { title: 'حاسبة الذهب والمصنعية', description: 'احسب قيمة القطعة حسب الوزن والعيار والمصنعية.', url: `${SITE_URL}/calculator/` } };
export default async function CalculatorPage() {
 const [prices, history] = await Promise.all([fetchServerPrices().catch(() => null), fetchHistory().catch(() => [])]);
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem', position:1, name:'الرئيسية', item:SITE_URL },{ '@type':'ListItem', position:2, name:'حاسبة الذهب', item:SITE_URL+'/calculator/' }] }) }} /><CalculatorClient initialPrices={prices} />{history.length >= 2 && <div className="container" style={{ paddingBottom:50 }}><SimplePriceChart data={history} /></div>}</>;
}
