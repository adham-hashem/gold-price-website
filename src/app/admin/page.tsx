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
        <div className="container page-content" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="tool-header">
                <h1>⚙️ إعدادات <span className="gold-text">النظام</span></h1>
                <button onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} style={{ background: 'none', border: 'none', color: 'var(--red-400)', cursor: 'pointer' }}>تسجيل الخروج</button>
            </div>

            {/* Market Rates Section */}
            <div className="card">
                <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>💰 تحديث سعر صرف الذهب (دولار الصاغة)</h2>
                <form onSubmit={handleUpdateRate} style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>سعر الدولار مقابل الجنيه (Sagha Dollar)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={goldDollarRate}
                            onChange={(e) => setGoldDollarRate(e.target.value)}
                            className="input"
                            style={{ width: '100%' }}
                            placeholder="مثال: 55.0"
                            required
                        />
                    </div>
                    <button type="submit" className="logo-icon" style={{ padding: '12px 24px', border: 'none', cursor: 'pointer' }} disabled={rateLoading}>
                        {rateLoading ? 'جاري التحديث...' : 'حفظ السعر'}
                    </button>
                </form>
                <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--slate-400)' }}>
                    * هذا السعر هو الذي يتم استخدامه لتحويل سعر الذهب العالمي (الأونصة) إلى الجنيه المصري.
                </p>
            </div>

            <div className="tool-header" style={{ marginTop: '20px' }}>
                <h1>✍️ كتابة <span className="gold-text">مقال جديد</span></h1>
            </div>

            <div className="card">
                <form onSubmit={handleCreateArticle} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>عنوان المقال</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={() => setSlug(title.trim().replace(/\s+/g, '-').toLowerCase())}
                                className="input"
                                style={{ width: '100%' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>الرابط (Slug)</label>
                            <input 
                                type="text" 
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="input"
                                style={{ width: '100%' }}
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
                                style={{ width: '100%' }}
                                placeholder="اختياري - وصف مختصر للمقال يظهر في جوجل"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>التصنيف</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="input"
                                style={{ width: '100%' }}
                            >
                                <option value="أخبار">أخبار</option>
                                <option value="تحليلات">تحليلات</option>
                                <option value="نصائح">نصائح</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>محتوى المقال (يدعم HTML)</label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="input"
                            style={{ width: '100%', minHeight: '300px', lineHeight: '1.6' }}
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'var(--red-400)' }}>{error}</p>}
                    {success && <p style={{ color: 'var(--green-400)' }}>{success}</p>}

                    <button type="submit" className="logo-icon" style={{ width: '200px', border: 'none', cursor: 'pointer' }} disabled={loading}>
                        {loading ? 'جاري النشر...' : 'نشر المقال الآن'}
                    </button>
                </form>
            </div>
        </div>
    );
}
