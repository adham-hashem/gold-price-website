import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { jsonLd } from '@/lib/server/content';

const description = 'تابع أسعار الذهب اليوم في مصر لعيار ٢١ و٢٤ و١٨ والجنيه الذهب. أسعار استرشادية محدثة، حاسبة المصنعية وتحويل العيارات مع توضيح مصادر البيانات.';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'أسعار الذهب اليوم في مصر | عيار ٢١ و٢٤ و١٨ والجنيه الذهب',
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: { title: SITE_NAME, description, url: SITE_URL, siteName: SITE_NAME, locale: 'ar_EG', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'أسعار الذهب مصر — أسعار وأدوات ومصادر معلنة' }] },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description, images: ['/opengraph-image'] },
  robots: { index: !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production', follow: true, googleBot: { index: !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production', follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: { icon: '/favicon_io/favicon.ico', apple: '/favicon_io/apple-touch-icon.png' },
  manifest: '/manifest.json',
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#123c31' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = [
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': SITE_URL + '/#website', name: SITE_NAME, url: SITE_URL, inLanguage: 'ar-EG' },
    { '@context': 'https://schema.org', '@type': 'Organization', '@id': SITE_URL + '/#organization', name: SITE_NAME, url: SITE_URL, logo: SITE_URL + '/favicon_io/android-chrome-512x512.png' },
  ];
  const adsense = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  return <html lang="ar" dir="rtl"><body>
    <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    <Header /><main id="main-content">{children}</main><Footer />
    {adsense && <Script src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`} crossOrigin="anonymous" strategy="lazyOnload" />}
    <Analytics /><SpeedInsights />
  </body></html>;
}
