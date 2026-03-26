import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, formatDate } from "@/lib/articleService";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.egyptgold.online";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);

    if (!article) return { title: "المقال غير موجود" };

    return {
        title: `${article.title} | أسعار الذهب مصر`,
        description: article.metaDescription || article.content.substring(0, 155),
        alternates: {
            canonical: `/articles/${slug}/`,
        },
        openGraph: {
            title: article.title,
            description: article.metaDescription || article.content.substring(0, 155),
            url: `${SITE_URL}/articles/${slug}/`,
            type: "article",
            publishedTime: article.publishedAt,
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.metaDescription || article.content.substring(0, 155),
        },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);

    if (!article) notFound();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "datePublished": article.publishedAt,
        "description": article.metaDescription || article.content.substring(0, 160),
        "author": {
            "@type": "Organization",
            "name": "أسعار الذهب مصر"
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
                        <span className="category-badge">{article.category}</span>
                        <time>{formatDate(article.publishedAt)}</time>
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
                    <h3>أعجبك هذا المقال؟ شاركه مع الآخرين:</h3>
                    <div className="share-buttons">
                        {/* Add simple social sharing links here */}
                        <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}/articles/${slug}/`}
                            target="_blank" rel="noopener noreferrer"
                            className="share-btn fb"
                        >
                            فيسبوك
                        </a>
                        <a 
                            href={`https://twitter.com/intent/tweet?url=${SITE_URL}/articles/${slug}/&text=${article.title}`}
                            target="_blank" rel="noopener noreferrer"
                            className="share-btn tw"
                        >
                            تويتر
                        </a>
                        <a 
                            href={`https://api.whatsapp.com/send?text=${article.title} - ${SITE_URL}/articles/${slug}/`}
                            target="_blank" rel="noopener noreferrer"
                            className="share-btn wa"
                        >
                            واتساب
                        </a>
                    </div>
                </div>
            </article>
        </div>
    );
}
