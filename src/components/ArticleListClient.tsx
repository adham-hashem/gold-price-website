'use client';

import React, { useState } from 'react';
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/lib/articleService";
import AdSlot from "@/components/AdSlot";

interface ArticleListClientProps {
    initialArticles: Article[];
}

export default function ArticleListClient({ initialArticles }: ArticleListClientProps) {
    const [activeCategory, setActiveCategory] = useState('الكل');
    const categories = ['الكل', 'أخبار', 'تحليلات', 'نصائح'];

    const filteredArticles = activeCategory === 'الكل' 
        ? initialArticles 
        : initialArticles.filter(a => a.category === activeCategory);

    return (
        <>
            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '30px',
                            border: activeCategory === cat ? 'none' : '1px solid var(--border-subtle)',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            background: activeCategory === cat ? 'var(--gold-500)' : 'var(--card-bg)',
                            color: activeCategory === cat ? 'white' : 'var(--text-primary)',
                            boxShadow: activeCategory === cat ? '0 4px 15px rgba(184, 134, 11, 0.3)' : 'var(--shadow-sm)',
                        }}
                    >
                        {cat === 'الكل' ? 'جميع المقالات' : cat === 'أخبار' ? 'أخبار الذهب' : cat === 'تحليلات' ? 'تحليلات السوق' : 'نصائح الادخار'}
                    </button>
                ))}
            </div>

            <div className="main-layout">
                <div className="main-content">
                        <section className="articles-grid">
                            <AdSlot type="banner" id="ad-articles-top" />
                            
                            {filteredArticles.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>لا توجد مقالات في هذا القسم حالياً.</p>
                                    <button 
                                        onClick={() => setActiveCategory('الكل')}
                                        style={{ color: 'var(--gold-600)', background: 'none', border: 'none', fontWeight: 700, marginTop: '10px', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        عرض جميع المقالات
                                    </button>
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr', 
                                    gap: '20px',
                                    animation: 'fadeIn 0.5s ease-out'
                                }}>
                                    {filteredArticles.map((article, index) => (
                                        <React.Fragment key={article.id}>
                                            <ArticleCard article={article} />
                                            {(index + 1) % 3 === 0 && (
                                                <AdSlot type="inline" id={`ad-articles-list-${index}`} />
                                            )}
                                        </React.Fragment>
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

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
