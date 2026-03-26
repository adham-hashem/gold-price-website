import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchArticles, formatDate } from "@/lib/articleService";
import Link from "next/link";

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

    // Fetch related articles
    const allArticles = await fetchArticles();
    const relatedArticles = allArticles
        .filter(a => a.slug !== slug)
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
                        <Link href="/articles" className="category-badge">{article.category || 'أخبار'}</Link>
                        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    </div>
                    <h1>{article.title}</h1>
                </header>

                <div className="card article-body">
                    <div 
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

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
