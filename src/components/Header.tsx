'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

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
                    <Link href="/" className="logo">
                        <div className="logo-icon">🥇</div>
                        <span>أسعار الذهب مصر</span>
                    </Link>

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
