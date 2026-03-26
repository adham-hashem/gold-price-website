import React from 'react';
import Link from 'next/link';
import { Article, formatDate } from '@/lib/articleService';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const excerpt = article.metaDescription || 
        article.content.replace(/<[^>]*>/g, '').substring(0, 140) + '...';

    return (
        <article className="card article-card animate-fadeInUp" style={{ padding: '30px' }}>
            <div className="article-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.85rem' }}>
                <span className="category-badge" style={{ fontSize: '0.75rem' }}>{article.category || 'أخبار'}</span>
                <span className="article-date" style={{ color: 'var(--text-muted)' }}>{formatDate(article.publishedAt)}</span>
            </div>
            <Link href={`/articles/${article.slug}/`} style={{ display: 'block', marginBottom: '12px' }}>
                <h3 className="article-title" style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: '1.3', color: 'var(--text-primary)' }}>
                    {article.title}
                </h3>
            </Link>
            <p className="article-excerpt" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                {excerpt}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Link href={`/articles/${article.slug}/`} className="read-more" style={{ 
                    fontWeight: 700, 
                    color: 'var(--text-gold)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '0.9rem'
                }}>
                    اقرأ المقال بالكامل <span style={{ fontSize: '1.1rem' }}>←</span>
                </Link>
            </div>
        </article>
    );
}
