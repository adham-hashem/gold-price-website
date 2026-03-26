import React from 'react';
import Link from 'next/link';
import { Article, formatDate } from '@/lib/articleService';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    return (
        <article className="card article-card animate-fadeInUp">
            <div className="article-meta">
                <span className="article-category">{article.category}</span>
                <span className="article-date">{formatDate(article.publishedAt)}</span>
            </div>
            <Link href={`/articles/${article.slug}/`}>
                <h3 className="article-title">{article.title}</h3>
            </Link>
            <p className="article-excerpt">
                {article.metaDescription || (article.content.length > 120 ? article.content.substring(0, 120) + '...' : article.content)}
            </p>
            <Link href={`/articles/${article.slug}/`} className="read-more">
                اقرأ المزيد ←
            </Link>
        </article>
    );
}
