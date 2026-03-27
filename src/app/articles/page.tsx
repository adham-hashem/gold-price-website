import type { Metadata } from "next";
import { fetchArticles } from "@/lib/articleService";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

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

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams: { category?: string };
}) {
    const allArticles = await fetchArticles();
    const activeCategory = searchParams.category || 'الكل';

    const filteredArticles = activeCategory === 'الكل' 
        ? allArticles 
        : allArticles.filter(a => a.category === activeCategory);

    const categories = ['الكل', 'أخبار', 'تحليلات', 'نصائح'];

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

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={cat === 'الكل' ? '/articles/' : `/articles/?category=${cat}`}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s',
                            background: activeCategory === cat ? 'var(--gold-500)' : 'var(--card-bg)',
                            color: activeCategory === cat ? 'white' : 'var(--text-primary)',
                            boxShadow: activeCategory === cat ? '0 4px 15px rgba(184, 134, 11, 0.3)' : 'var(--shadow-sm)',
                            border: activeCategory === cat ? 'none' : '1px solid var(--border-subtle)'
                        }}
                    >
                        {cat === 'الكل' ? 'جميع المقالات' : cat === 'أخبار' ? 'أخبار الذهب' : cat === 'تحليلات' ? 'تحليلات السوق' : 'نصائح الادخار'}
                    </Link>
                ))}
            </div>

            <div className="main-layout">
                <div className="main-content">
                    <section className="articles-grid">
                        {filteredArticles.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>لا توجد مقالات في هذا القسم حالياً.</p>
                                <a href="/articles/" style={{ color: 'var(--gold-600)', fontWeight: 700, marginTop: '10px', display: 'inline-block' }}>عرض جميع المقالات</a>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                {filteredArticles.map((article) => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="sidebar">
                    <div className="card" style={{ borderRight: '4px solid var(--gold-500)' }}>
                        <h3 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>💡 نصيحة الخبراء</h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            الذهب هو الملاذ الآمن والادخار فيه يفضل أن يكون للمدى الطويل (أكثر من عام) للحصول على أفضل عائد وحماية لقيمة مدخراتك من التضخم.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
