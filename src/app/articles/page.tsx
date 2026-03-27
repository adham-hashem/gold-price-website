import type { Metadata } from "next";
import { fetchArticles } from "@/lib/articleService";
import ArticleListClient from "@/components/ArticleListClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.egyptgold.online";

export const metadata: Metadata = {
    title: "أخبار الذهب والتحليلات الاقتصادية في مصر | أسعار الذهب اليوم",
    description: "تابع آخر أخبار الذهب ومقالات التحليل الاقتصادي في السوق المصري. نصائح للادخار والاستثمار في الذهب، وتوقعات الأسعار العالمية والمحلية.",
    keywords: ["أخبار الذهب", "تحليل سوق الذهب", "استثمار الذهب في مصر", "توقعات سعر الذهب"],
    alternates: {
        canonical: "/articles/",
    },
    openGraph: {
        title: "أخبار الذهب والتحليلات الاقتصادية في مصر",
        description: "مقالات وتحليلات حصرية عن سوق الذهب المصري والعالمي.",
        url: `${SITE_URL}/articles/`,
    },
};

export default async function ArticlesPage() {
    const allArticles = await fetchArticles();

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
                "name": "أخبار الذهب",
                "item": `${SITE_URL}/articles/`
            }
        ]
    };

    return (
        <div className="container page-content">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <div className="tool-header">
                <h1>
                    📰 <span className="gold-text">أخبار الذهب</span> والتحليلات الاقتصادية
                </h1>
                <p>
                    مقالات تحليلية، نصائح استثمارية، وآخر مستجدات سوق الذهب في مصر
                </p>
            </div>

            <ArticleListClient initialArticles={allArticles} />
        </div>
    );
}
