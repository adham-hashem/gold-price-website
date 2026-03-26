import type { Metadata } from "next";
import { fetchArticles } from "@/lib/articleService";
import ArticleCard from "@/components/ArticleCard";

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
    const articles = await fetchArticles();

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

            <div className="main-layout">
                <div className="main-content">
                    <section className="articles-grid">
                        {articles.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                                <p style={{ color: 'var(--text-muted)' }}>جاري العمل على كتابة مقالات جديدة، تابعنا قريباً!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                {articles.map((article) => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="sidebar">
                    <div className="card">
                        <h3 className="section-title" style={{ fontSize: '1rem' }}>💡 نصيحة للادخار</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            الذهب هو الملاذ الآمن والادخار فيه يفضل أن يكون للمدى الطويل (أكثر من عام) للحصول على أفضل عائد وحماية لقيمة مدخراتك.
                        </p>
                    </div>
                    {/* Add more sidebars if needed */}
                </aside>
            </div>
        </div>
    );
}
