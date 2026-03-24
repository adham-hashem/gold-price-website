import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
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
    type: "website",
    locale: "ar_EG",
    siteName: "أسعار الذهب مصر",
  },
  twitter: {
    card: "summary_large_image",
    title: "أسعار الذهب اليوم في مصر",
    description: "تابع أسعار الذهب اليوم في مصر لحظة بلحظة. سعر جرام الذهب لجميع العيارات.",
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
      "url": "https://your-domain.com",
      "inLanguage": "ar",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://your-domain.com/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
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

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8f9fb" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
