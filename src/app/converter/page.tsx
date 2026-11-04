import type { Metadata } from 'next';
import ConverterClient from './ConverterClient';
import { fetchServerPrices } from '@/lib/server/prices';
import { SITE_URL } from '@/lib/site';
import { jsonLd } from '@/lib/server/content';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title:'تحويل عيارات الذهب | احسب الوزن المكافئ بين العيارات', description:'حوّل وزن الذهب بين عيارات ٢٤ و٢٢ و٢١ و١٨ و١٤، واحسب كمية الذهب الخالص والوزن المكافئ بسهولة.', alternates:{ canonical:'/converter/' }, openGraph:{ title:'محوّل عيارات الذهب', description:'اعرف الوزن المكافئ بين عيارات الذهب.', url:SITE_URL+'/converter/' } };
export default async function ConverterPage() {
 const prices = await fetchServerPrices().catch(() => null);
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html:jsonLd({ '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem', position:1, name:'الرئيسية', item:SITE_URL },{ '@type':'ListItem', position:2, name:'تحويل العيارات', item:SITE_URL+'/converter/' }] }) }} /><ConverterClient initialPrices={prices} /></>;
}
