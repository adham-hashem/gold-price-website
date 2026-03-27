import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchArticles, formatDate } from "@/lib/articleService";
import { fetchGoldPrices, formatPrice } from "@/lib/goldService";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.egyptgold.online";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);

    if (!article) return { title: "المقال غير موجود" };

    const description = article.metaDescription || 
        article.content.replace(/<[^>]*>/g, '').substring(0, 155);

    return {
        title: `${article.title} | أسعار الذهب مصر`,
        description: description,
        alternates: {
            canonical: `/articles/${slug}/`,
        },
        openGraph: {
            title: article.title,
            description: description,
            url: `${SITE_URL}/articles/${slug}/`,
            siteName: "أسعار الذهب مصر",
            locale: "ar_EG",
            type: "article",
            publishedTime: article.publishedAt,
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: description,
        },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);

    if (!article) notFound();
    
    // Fetch live prices if needed
    const goldPrices = article.showPrices ? await fetchGoldPrices().catch(() => null) : null;

    // Fetch related articles - prioritize same category
    const allArticles = await fetchArticles();
    const relatedArticles = allArticles
        .filter(a => a.slug !== slug)
        .sort((a, b) => {
            // Prefer same category
            if (a.category === article.category && b.category !== article.category) return -1;
            if (a.category !== article.category && b.category === article.category) return 1;
            return 0;
        })
        .slice(0, 3);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${SITE_URL}/articles/${slug}/`
        },
        "headline": article.title,
        "datePublished": article.publishedAt,
        "dateModified": article.publishedAt,
        "description": article.metaDescription || article.content.replace(/<[^>]*>/g, '').substring(0, 160),
        "author": {
            "@type": "Organization",
            "name": "أسعار الذهب مصر",
            "url": SITE_URL
        },
        "publisher": {
            "@type": "Organization",
            "name": "أسعار الذهب مصر",
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/favicon_io/android-chrome-512x512.png`
            }
        }
    };

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
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `${SITE_URL}/articles/${slug}/`
            }
        ]
    };

    return (
        <div className="container page-content">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            
            <article className="article-post">
                <header className="article-header">
                    <div className="article-meta">
                        <Link href={`/articles/?category=${article.category || 'أخبار'}`} className="category-badge">
                            {article.category || 'أخبار'}
                        </Link>
                        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    </div>
                    <h1>{article.title}</h1>
                </header>

                <AdSlot type="banner" id="ad-article-top" />

                <div className="card article-body">
                    {goldPrices && (
                        <div className="article-price-box" style={{ 
                            background: 'var(--gold-50)', 
                            border: '1px solid var(--gold-200)', 
                            borderRadius: 'var(--radius-lg)', 
                            padding: '24px', 
                            marginBottom: '24px',
                            textAlign: 'right'
                        }}>
                            <h3 style={{ color: 'var(--gold-800)', marginBottom: '16px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                📊 أسعار الذهب الآن <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>(تحديث لحظي)</span>
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                                <div style={{ background: 'var(--card-bg)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>عيار 24</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatPrice(goldPrices.karat24)} ج.م</div>
                                </div>
                                <div style={{ background: 'var(--card-bg)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gold-300)', boxShadow: '0 4px 12px rgba(184, 134, 11, 0.1)' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--gold-700)', fontWeight: 700 }}>عيار 21 (الأكثر طلباً)</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-600)' }}>{formatPrice(goldPrices.karat21)} ج.م</div>
                                </div>
                                <div style={{ background: 'var(--card-bg)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>عيار 18</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatPrice(goldPrices.karat18)} ج.م</div>
                                </div>
                                <div style={{ background: 'var(--card-bg)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>عيار 14</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatPrice(goldPrices.karat14)} ج.م</div>
                                </div>
                                <div style={{ background: 'var(--gold-600)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'white' }}>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>الجنيه الذهب</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{formatPrice(goldPrices.goldPound)} ج.م</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div 
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                <AdSlot type="banner" id="ad-article-bottom" />

                <div className="article-footer card">
                    <h3 style={{ marginBottom: '16px' }}>أعجبك هذا المقال؟ شاركه مع الآخرين:</h3>
                    <div className="share-buttons">
                        <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/articles/${slug}/`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="share-btn fb"
                        >
                            فيسبوك
                        </a>
                        <a 
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${SITE_URL}/articles/${slug}/`)}&text=${encodeURIComponent(article.title)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="share-btn tw"
                        >
                            تويتر
                        </a>
                        <a 
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${SITE_URL}/articles/${slug}/`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="share-btn wa"
                        >
                            واتساب
                        </a>
                    </div>
                </div>

                {/* Related Articles Section */}
                {relatedArticles.length > 0 && (
                    <section className="related-articles">
                        <div className="section-title">
                            <span className="icon">📰</span>
                            <h2>مقالات <span className="gold-text">ذات صلة</span></h2>
                        </div>
                        <div className="related-grid">
                            {relatedArticles.map((rel) => (
                                <Link key={rel.id} href={`/articles/${rel.slug}`} className="card related-card">
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)', fontWeight: 700 }}>{rel.category}</span>
                                    <h4>{rel.title}</h4>
                                    <span className="read-more">اقرأ المزيد ←</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </div>
    );
}
