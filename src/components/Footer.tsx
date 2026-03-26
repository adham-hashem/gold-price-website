import React from 'react';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-about">
                        <h3>🥇 أسعار الذهب مصر</h3>
                        <p>
                            موقعك الموثوق لمتابعة أسعار الذهب في مصر لحظة بلحظة.
                            نوفر لك أسعار جميع عيارات الذهب المحدثة باستمرار، مع
                            أدوات حساب المصنعية وتحويل العيارات لمساعدتك في اتخاذ
                            قرارات الشراء والبيع الصحيحة.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h3>روابط سريعة</h3>
                        <ul>
                            <li><Link href="/">أسعار الذهب اليوم</Link></li>
                            <li><Link href="/articles/">أخبار الذهب</Link></li>
                            <li><Link href="/calculator/">حاسبة الذهب</Link></li>
                            <li><Link href="/converter/">تحويل العيارات</Link></li>
                            <li><Link href="/about/">من نحن</Link></li>
                            <li><Link href="/privacy-policy/">سياسة الخصوصية</Link></li>
                        </ul>
                    </div>

                    <div className="footer-info">
                        <h3>معلومات</h3>
                        <p>
                            الأسعار المعروضة استرشادية وقد تختلف
                            قليلاً عن أسعار محلات الصاغة. يُنصح بالتأكد
                            من السعر الفعلي قبل عملية البيع أو الشراء.
                        </p>
                    </div>
                </div>

                {/* Ad Slot - Footer */}
                <div className="ad-slot ad-slot-banner" id="ad-footer">
                    <span className="ad-slot-label">إعلان</span>
                    <span>مساحة إعلانية - Footer Banner</span>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} أسعار الذهب مصر. جميع الحقوق محفوظة.
                    </p>
                    <p className="footer-disclaimer">
                        تنويه: الأسعار المعروضة تقريبية وللاسترشاد فقط. الأسعار الفعلية قد تختلف من محل لآخر.
                    </p>
                </div>
            </div>
        </footer>
    );
}
