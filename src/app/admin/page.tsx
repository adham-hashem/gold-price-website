'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Article Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [category, setCategory] = useState('أخبار');
    const [success, setSuccess] = useState('');
    const [articlesList, setArticlesList] = useState<any[]>([]);
    
    // Gold Dollar State
    const [goldDollarRate, setGoldDollarRate] = useState('');
    const [goldOunceOffset, setGoldOunceOffset] = useState('');
    const [rateLoading, setRateLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                setIsLoggedIn(true);
                localStorage.setItem('adminToken', data.token);
                fetchCurrentRate();
                fetchArticlesList();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('خطأ في الاتصال بالسيرفر');
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentRate = async () => {
        try {
            const res = await fetch(`${API_URL}/api/settings/all`);
            if (res.ok) {
                const data = await res.json();
                const rate = data.find((s: any) => s.key === 'usd-egp-rate');
                const offset = data.find((s: any) => s.key === 'ounce-offset');
                if (rate) setGoldDollarRate(rate.value);
                if (offset) setGoldOunceOffset(offset.value);
            }
        } catch (e) {}
    };

    const fetchArticlesList = async () => {
        try {
            const res = await fetch(`${API_URL}/api/articles`);
            if (res.ok) {
                const data = await res.json();
                setArticlesList(data);
            }
        } catch (e) {}
    };

    const handleUpdateSetting = async (key: string, value: string) => {
        setRateLoading(true);
        setSuccess('');
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/admin/settings`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key, value })
            });
            if (res.ok) {
                setSuccess('تم التحديث بنجاح!');
                fetchCurrentRate();
            } else {
                setError('فشل في التحديث');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال');
        } finally {
            setRateLoading(false);
        }
    };

    const handleUpdateRate = (e: React.FormEvent) => {
        e.preventDefault();
        handleUpdateSetting('usd-egp-rate', goldDollarRate);
    };

    const handleUpdateOffset = (e: React.FormEvent) => {
        e.preventDefault();
        handleUpdateSetting('ounce-offset', goldOunceOffset);
    };

    const handleCreateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/admin/articles`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, slug, content, metaDescription, category })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('تم نشر المقال بنجاح!');
                setTitle('');
                setSlug('');
                setContent('');
                setMetaDescription('');
                fetchArticlesList(); // Refresh list
            } else {
                setError(data.error || 'فشل في نشر المقال. تأكد من أن الرابط (slug) غير مكرر.');
            }
        } catch (err) {
            setError('حدث خطأ غير متوقع في الاتصال');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteArticle = async (id: number) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
        
        try {
            const res = await fetch(`${API_URL}/api/admin/articles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchArticlesList();
            } else {
                alert('فشل في حذف المقال');
            }
        } catch (e) {
            alert('خطأ في الاتصال');
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
            setIsLoggedIn(true);
            fetchCurrentRate();
            fetchArticlesList();
        }
    }, []);

    if (!isLoggedIn) {
        // ... (no changes to this part)
        return null; // temporary
    }

    return (
        <div className="container page-content" style={{ maxWidth: '1000px' }}>
            {/* Header */}
            <div className="tool-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900 }}>
                        🎛️ لوحة <span className="gold-text">التحكم</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>إدارة أسعار السوق والمقالات الإخبارية</p>
                </div>
                <button 
                    onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} 
                    style={{ 
                        padding: '10px 20px', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: 'var(--red-500)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                >
                    تسجيل الخروج
                </button>
            </div>

            {/* Dashboard Stats & Market Rate */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="card" style={{ borderLeft: '5px solid var(--gold-500)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>السعر الأساسي للدولار (البنك)</span>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                                {goldDollarRate || '---'} <span style={{ fontSize: '1rem' }}>ج.م</span>
                            </div>
                        </div>
                        <div style={{ width: '50px', height: '50px', background: 'var(--gold-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                            🏦
                        </div>
                    </div>
                </div>

                <div className="card" style={{ borderLeft: '5px solid var(--gold-500)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>فجوة الصاغة (علاوة السوق)</span>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                                {goldOunceOffset || '0'} <span style={{ fontSize: '1rem' }}>ج.م</span>
                            </div>
                        </div>
                        <div style={{ width: '50px', height: '50px', background: 'var(--gold-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                            ⚖️
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="card">
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>🏦 تحديث السعر الأساسي للدولار</h3>
                    <form onSubmit={handleUpdateRate} style={{ display: 'flex', gap: '12px' }}>
                        <input 
                            type="number" 
                            step="0.01"
                            value={goldDollarRate}
                            onChange={(e) => setGoldDollarRate(e.target.value)}
                            className="input"
                            style={{ flex: 1, padding: '12px' }}
                            placeholder="50.70..."
                            required
                        />
                        <button type="submit" className="logo-icon" style={{ padding: '0 24px', height: '48px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)' }} disabled={rateLoading}>
                            تحديث
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>⚖️ تحديث فجوة / علاوة الصاغة</h3>
                    <form onSubmit={handleUpdateOffset} style={{ display: 'flex', gap: '12px' }}>
                        <input 
                            type="number" 
                            step="0.1"
                            value={goldOunceOffset}
                            onChange={(e) => setGoldOunceOffset(e.target.value)}
                            className="input"
                            style={{ flex: 1, padding: '12px' }}
                            placeholder="+2.5 أو +5.0..."
                            required
                        />
                        <button type="submit" className="logo-icon" style={{ padding: '0 24px', height: '48px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)' }} disabled={rateLoading}>
                            حفظ
                        </button>
                    </form>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '40px', padding: '15px', background: 'var(--gold-50)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--gold-200)' }}>
                <p style={{ fontWeight: 700, color: 'var(--gold-800)' }}>
                    💵 دولار الصاغة الفعلي: <span style={{ fontSize: '1.4rem' }}>{(parseFloat(goldDollarRate) || 0) + (parseFloat(goldOunceOffset) || 0)}</span> ج.م
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    (السعر الأساسي + الفجوة)
                </p>
            </div>
            {success && <div className="card" style={{ marginBottom: '40px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--green-500)', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.2)' }}>{success}</div>}
            {error && <div className="card" style={{ marginBottom: '40px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red-500)', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

            {/* Article Creation Section */}
            <div className="tool-header" style={{ textAlign: 'right', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                    ✍️ نشر <span className="gold-text">مقال جديد</span>
                </h2>
            </div>

            <div className="card" style={{ padding: '32px' }}>
                <form onSubmit={handleCreateArticle} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>عنوان المقال</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={() => !slug && setSlug(title.trim().replace(/\s+/g, '-').toLowerCase())}
                                className="input"
                                style={{ width: '100%', padding: '14px' }}
                                placeholder="أدخل عنواناً جذاباً لمقالك..."
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>رابط المقال (Slug)</label>
                            <input 
                                type="text" 
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="input"
                                style={{ width: '100%', padding: '14px' }}
                                placeholder="example-article-link"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>وصف محركات البحث (Meta Description)</label>
                            <input 
                                type="text" 
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                className="input"
                                style={{ width: '100%', padding: '14px' }}
                                placeholder="اكتب وصفاً مختصراً يظهر في نتائج بحث جوجل..."
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>التصنيف</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="input"
                                style={{ width: '100%', padding: '14px' }}
                            >
                                <option value="أخبار">أخبار الذهب اليوم</option>
                                <option value="تحليلات">تحليلات السوق</option>
                                <option value="نصائح">نصائح الشراء والادخار</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>محتوى المقال (يدعم HTML)</label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="input"
                            style={{ 
                                width: '100%', 
                                minHeight: '400px', 
                                padding: '20px', 
                                lineHeight: '1.8', 
                                fontSize: '1rem',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                outline: 'none'
                            }}
                            placeholder="ابدأ بكتابة محتوى المقال هنا... يمكنك استخدام وسوم HTML مثل <h2> و <p> و <ul>"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
                        {error && <p style={{ color: 'var(--red-400)', fontWeight: 600 }}>{error}</p>}
                        <button 
                            type="submit" 
                            className="logo-icon" 
                            style={{ 
                                width: '240px', 
                                height: '56px', 
                                border: 'none', 
                                cursor: 'pointer', 
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                boxShadow: '0 10px 20px rgba(184, 134, 11, 0.2)'
                            }} 
                            disabled={loading}
                        >
                            {loading ? 'جاري النشر...' : 'نشر المقال الآن 🚀'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Articles List Section */}
            <div className="tool-header" style={{ textAlign: 'right', marginTop: '60px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                    📂 إدارة <span className="gold-text">المقالات المنشورة</span>
                </h2>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                        <thead>
                            <tr style={{ background: 'var(--gold-50)', borderBottom: '1px solid var(--border-subtle)' }}>
                                <th style={{ padding: '16px', fontWeight: 800 }}>العنوان</th>
                                <th style={{ padding: '16px', fontWeight: 800 }}>التصنيف</th>
                                <th style={{ padding: '16px', fontWeight: 800 }}>التاريخ</th>
                                <th style={{ padding: '16px', fontWeight: 800 }}>العمليات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articlesList.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>لا توجد مقالات منشورة بعد.</td>
                                </tr>
                            ) : (
                                articlesList.map((article) => (
                                    <tr key={article.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '16px', fontWeight: 600 }}>{article.title}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.8rem', 
                                                background: article.category === 'أخبار' ? 'rgba(59, 130, 246, 0.1)' : article.category === 'تحليلات' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: article.category === 'أخبار' ? '#3b82f6' : article.category === 'تحليلات' ? '#10b981' : '#f59e0b'
                                            }}>
                                                {article.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            {new Date(article.publishedAt).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <a 
                                                    href={`/articles/${article.slug}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ color: 'var(--gold-600)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}
                                                >
                                                    عرض 👁️
                                                </a>
                                                <button 
                                                    onClick={() => handleDeleteArticle(article.id)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--red-500)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                                                >
                                                    حذف 🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
