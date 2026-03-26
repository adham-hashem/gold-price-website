import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";
import { fetchPriceHistory } from "@/lib/goldService";
import SimplePriceChart from "@/components/SimplePriceChart";

export const metadata: Metadata = {
    title: "حاسبة سعر الذهب والمصنعية - أسعار الذهب مصر",
    description: "احسب سعر الذهب مع المصنعية لجميع العيارات. حاسبة دقيقة تعتمد على أسعار الذهب المحدثة لحظة بلحظة في مصر.",
    keywords: ["حاسبة الذهب", "مصنعية الذهب", "سعر جرام الذهب", "حاسبة سعر الذهب مصر"],
    openGraph: {
        title: "حاسبة سعر الذهب والمصنعية - أسعار الذهب مصر",
        description: "احسب سعر الذهب مع المصنعية لجميع العيارات في مصر",
    },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.egyptgold.online";

export default async function CalculatorPage() {
    const history = await fetchPriceHistory().catch(() => []);

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
                "name": "حاسبة الذهب والمصنعية",
                "item": `${SITE_URL}/calculator/`
            }
        ]
    };

    const howToLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "كيفية حساب سعر الذهب بالمصنعية في مصر",
        "description": "خطوات بسيطة لحساب السعر النهائي للمشغولات الذهبية شاملة الضريبة والمصنعية.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "اختر العيار",
                "text": "حدد عيار الذهب (21، 18، أو 24) المُراد شراؤه."
            },
            {
                "@type": "HowToStep",
                "name": "أدخل الوزن",
                "text": "اكتب وزن القطعة الذهبية بالجرام."
            },
            {
                "@type": "HowToStep",
                "name": "أدخل سعر المصنعية",
                "text": "أدخل سعر مصنعية الجرام الواحد المتفق عليه مع الصائغ."
            },
            {
                "@type": "HowToStep",
                "name": "عرض النتيجة",
                "text": "ستظهر لك التكلفة الإجمالية شاملة سعر الذهب الخام والمصنعية."
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
            
            <div className="main-layout" style={{ marginTop: '20px' }}>
                <div className="main-content">
                    <CalculatorClient />
                </div>
                <aside className="sidebar">
                    <SimplePriceChart data={history} />
                    <div className="card">
                        <h3 className="section-title" style={{ fontSize: '0.9rem' }}>💡 نصيحة سريعة</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            عند استخدام الحاسبة، تأكد من سؤال الصائغ عن "سعر المصنعية" قبل "سعر الجرام"، فالمصنعية هي المكان الذي يحدث فيه التفاوض عادة.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
