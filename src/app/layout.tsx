import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Cairo, Tajawal } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cairo",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.egyptgold.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "أسعار الذهب اليوم في مصر | تحديث لحظي لسعر جرام الذهب عيار 21، 18، 24",
  description: "تابع أسعار الذهب اليوم في مصر لحظة بلحظة. تغطية شاملة لسعر جرام الذهب عيار 21، عيار 18، وعيار 24 في محلات الصاغة المصرية. حاسبة دقيقة للمصنعية وتحويل العيارات وأسعار الأونصة عالمياً.",
  keywords: [
    "أسعار الذهب اليوم",
    "سعر الذهب في مصر",
    "سعر جرام الذهب عيار 21 اليوم",
    "سعر الذهب عيار 18 اليوم في مصر",
    "سعر الذهب عيار 24",
    "سعر الجنيه الذهب اليوم",
    "تحديث لحظي لأسعار الذهب",
    "سعر الأونصة عالمياً بالدولار",
    "مصنعية الذهب في مصر",
    "أسعار الذهب في محلات الصاغة",
    "gold prices egypt",
    "حاسبة الذهب والمصنعية",
    "تحويل عيارات الذهب",
  ],
  openGraph: {
    title: "أسعار الذهب اليوم في مصر - محدثة لحظة بلحظة",
    description: "تابع أسعار الذهب اليوم في مصر لحظة بلحظة. جميع العيارات 24 و 22 و 21 و 18. حاسبة المصنعية وتحويل العيارات.",
    url: SITE_URL,
    type: "website",
    locale: "ar_EG",
    siteName: "أسعار الذهب مصر",
    images: [
      {
        url: "/favicon_io/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "أسعار الذهب في مصر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أسعار الذهب اليوم في مصر",
    description: "تابع أسعار الذهب اليوم في مصر لحظة بلحظة. سعر جرام الذهب لجميع العيارات.",
    images: ["/favicon_io/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon.ico' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png' },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
  verification: {
    // Add your Google Search Console verification token here
    // google: "YOUR_VERIFICATION_TOKEN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "أسعار الذهب مصر",
      "description": "أسعار الذهب اليوم في مصر لحظة بلحظة",
      "url": SITE_URL,
      "inLanguage": "ar",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "أسعار الذهب مصر",
      "url": SITE_URL,
      "logo": `${SITE_URL}/favicon_io/android-chrome-512x512.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "",
        "contactType": "customer service",
        "areaServed": "EG",
        "availableLanguage": "Arabic"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "كيف أحسب سعر الذهب بالمصنعية في مصر؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "لحساب السعر النهائي: (وزن الذهب × سعر العيار) + (وزن الذهب × سعر المصنعية). تختلف المصنعية حسب التصميم والعيار."
          }
        },
        {
          "@type": "Question",
          "name": "ما هو الفرق بين ذهب عيار 21 وعيار 18؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "عيار 21 يحتوي على نسبة ذهب أعلى وهو الأكثر شيوعاً للادخار، بينما عيار 18 يستخدم في المشغولات ذات التصميم الدقيق."
          }
        },
        {
          "@type": "Question",
          "name": "ما هو وزن الجنيه الذهب في مصر؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "الجنيه الذهب الإسلامي أو الشعبي يزن 8 جرامات من الذهب عيار 21."
          }
        }
      ]
    }
  ];

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "ca-pub-3207777897976930";

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8f9fb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
