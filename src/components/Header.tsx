"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fetchGoldPrices, formatPrice } from '@/lib/goldService';

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [goldPound, setGoldPound] = useState<number | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const loadPound = async () => {
            try {
                const prices = await fetchGoldPrices();
                if (prices) setGoldPound(prices.goldPound);
            } catch (e) {
                console.error('Failed to load pound price in header', e);
            }
        };
        loadPound();
    }, []);

    const links = [
        { href: '/', label: 'أسعار اليوم', icon: '📊' },
        { href: '/articles/', label: 'أخبار الذهب', icon: '📰' },
        { href: '/calculator/', label: 'حاسبة الذهب', icon: '🧮' },
        { href: '/converter/', label: 'تحويل العيارات', icon: '🔄' },
    ];

    return (
        <header className="header">
            <div className="container">
                <div className="header-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link href="/" className="logo">
                            <div className="logo-icon">🥇</div>
                            <span>أسعار الذهب مصر</span>
                        </Link>
                        
                        {goldPound && (
                            <div className="header-price-badge animate-fadeIn" style={{ 
                                background: 'var(--gold-500)', 
                                color: 'white', 
                                padding: '4px 12px', 
                                borderRadius: '20px', 
                                fontSize: '0.85rem', 
                                fontWeight: 800,
                                boxShadow: '0 4px 10px rgba(184, 134, 11, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <span style={{ opacity: 0.9, fontWeight: 400 }}>الجنيه الذهب:</span>
                                <span>{formatPrice(goldPound)} ج.م</span>
                            </div>
                        )}
                    </div>

                    <nav>
                        <ul className="nav-links">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={pathname === link.href || pathname === link.href.slice(0, -1) ? 'active' : ''}
                                    >
                                        {link.icon} {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="القائمة"
                    >
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>

                <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={pathname === link.href || pathname === link.href.slice(0, -1) ? 'active' : ''}
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
