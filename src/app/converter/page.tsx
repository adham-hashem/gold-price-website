import type { Metadata } from "next";
import ConverterClient from "./ConverterClient";

export const metadata: Metadata = {
    title: "تحويل بين عيارات الذهب - أسعار الذهب مصر",
    description: "حوّل بين عيارات الذهب المختلفة (24، 22، 21، 18، 14) بسهولة. اعرف الفرق في الوزن والقيمة بين العيارات المختلفة.",
    keywords: ["تحويل عيارات الذهب", "تحويل ذهب", "عيار 21 لـ 18", "حاسبة عيارات الذهب"],
    openGraph: {
        title: "تحويل بين عيارات الذهب - أسعار الذهب مصر",
        description: "حوّل بين عيارات الذهب المختلفة واعرف الفرق في الوزن والقيمة",
    },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.egyptgold.online";

export default function ConverterPage() {
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": SITE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "تحويل عيارات الذهب",
                "item": `${SITE_URL}/converter/`
            }
        ]
    };

    const howToLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "كيفية التحويل بين عيارات الذهب المختلفة",
        "description": "تعلم كيف تحول وزن الذهب من عيار إلى آخر (مثلاً من عيار 21 إلى عيار 18) لمعرفة القيمة الحقيقية.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "اختر العيار الحالي",
                "text": "حدد عيار الذهب الذي تمتلكه حالياً (مثلاً عيار 21)."
            },
            {
                "@type": "HowToStep",
                "name": "أدخل الوزن الحالي",
                "text": "اكتب وزن الذهب الحالي بالجرام."
            },
            {
                "@type": "HowToStep",
                "name": "اختر العيار المطلوب",
                "text": "حدد العيار الذي تود التحويل إليه (مثلاً عيار 18)."
            },
            {
                "@type": "HowToStep",
                "name": "احصل على الوزن المعادل",
                "text": "ستقوم الحاسبة بضرب الوزن الحالي في نسبة نقاء العيار الحالي وقسمته على نقاء العيار المطلوب لتعطيك الوزن المعادل."
            }
        ]
    };

    return (
        <div className="container">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
            />
            <ConverterClient />
        </div>
    );
}
