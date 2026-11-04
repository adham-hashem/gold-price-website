'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Gem, ArrowUpLeft } from 'lucide-react';
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [{ href: '/', label: 'أسعار اليوم' }, { href: '/articles/', label: 'أخبار الذهب' }, { href: '/converter/', label: 'تحويل العيارات' }, { href: '/methodology/', label: 'مصادر الأسعار' }];
  return <header className="header site-header"><div className="container header-inner">
    <Link href="/" className="brand" aria-label="أسعار الذهب مصر — الرئيسية"><span className="brand-mark"><Gem size={26} strokeWidth={1.6} /></span><span>أسعار الذهب <b>مصر</b><small>EGYPT GOLD · دليلك لقيمة الذهب</small></span></Link>
    <nav className="desktop-navigation" aria-label="القائمة الرئيسية">{links.map(l => <Link key={l.href} href={l.href} className={pathname === l.href || pathname + '/' === l.href ? 'active' : ''}>{l.label}</Link>)}</nav>
    <Link href="/calculator/" className="button button-dark header-calculator">احسب قيمة ذهبك <ArrowUpLeft size={17} /></Link>
    <button className="menu-toggle" aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </div><nav id="mobile-navigation" className={`mobile-navigation ${open ? 'is-open' : ''}`} aria-label="قائمة الهاتف">{[...links, { href: '/calculator/', label: 'حاسبة الذهب' }].map(l => <Link href={l.href} key={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}</nav></header>;
}
