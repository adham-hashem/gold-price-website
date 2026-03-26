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
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('خطأ في الاتصال بالسيرفر');
        } finally {
            setLoading(false);
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
        <div className="container page-content">
            <div className="tool-header">
                <h1>✍️ كتابة <span className="gold-text">مقال جديد</span></h1>
                <button onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} style={{ background: 'none', border: 'none', color: 'var(--red-400)', cursor: 'pointer' }}>تسجيل الخروج</button>
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
