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
    
    // Gold Dollar State
    const [goldDollarRate, setGoldDollarRate] = useState('');
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
            const res = await fetch(`${API_URL}/api/settings/usd-egp-rate`);
            const data = await res.json();
            if (data.value) setGoldDollarRate(data.value);
        } catch (e) {}
    };

    const handleUpdateRate = async (e: React.FormEvent) => {
        e.preventDefault();
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
                body: JSON.stringify({ key: 'usd-egp-rate', value: goldDollarRate })
            });
            if (res.ok) {
                setSuccess('تم تحديث سعر دولار الصاغة بنجاح!');
            } else {
                setError('فشل في تحديث السعر');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال');
        } finally {
            setRateLoading(false);
        }
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
            if (res.ok) {
                setSuccess('تم نشر المقال بنجاح!');
                setTitle('');
                setSlug('');
                setContent('');
                setMetaDescription('');
            } else {
                setError('فشل في نشر المقال');
            }
        } catch (err) {
            setError('حدث خطأ غير متوقع');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
            setIsLoggedIn(true);
            fetchCurrentRate();
        }
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="container" style={{ maxWidth: '400px', padding: '100px 20px' }}>
                <div className="card">
                    <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>لوحة التحكم</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>كلمة المرور</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                style={{ width: '100%', padding: '12px' }}
                                required
                            />
                        </div>
                        {error && <p style={{ color: 'var(--red-400)', fontSize: '0.85rem' }}>{error}</p>}
                        <button type="submit" className="logo-icon" style={{ width: '100%', border: 'none', cursor: 'pointer' }} disabled={loading}>
                            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
                        </button>
                    </form>
                </div>
            </div>
        );
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
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>سعر دولار الصاغة الحالي</span>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                                {goldDollarRate || '---'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ج.م</span>
                            </div>
                        </div>
                        <div style={{ width: '50px', height: '50px', background: 'var(--gold-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                            💰
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>🔄 تحديث سعر دولار الصاغة</h3>
                    <form onSubmit={handleUpdateRate} style={{ display: 'flex', gap: '12px' }}>
                        <input 
                            type="number" 
                            step="0.01"
                            value={goldDollarRate}
                            onChange={(e) => setGoldDollarRate(e.target.value)}
                            className="input"
                            style={{ flex: 1, padding: '12px' }}
                            placeholder="السعر الجديد..."
                            required
                        />
                        <button type="submit" className="logo-icon" style={{ padding: '0 24px', height: '48px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)' }} disabled={rateLoading}>
                            {rateLoading ? '...' : 'تحديث'}
                        </button>
                    </form>
                    {success && <p style={{ color: 'var(--green-500)', fontSize: '0.85rem', marginTop: '8px' }}>{success}</p>}
                </div>
            </div>

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
                        {success && <p style={{ color: 'var(--green-500)', fontWeight: 600 }}>{success}</p>}
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
        </div>
    );
}
