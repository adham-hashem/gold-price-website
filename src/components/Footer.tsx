import Link from 'next/link';
import { Gem, ArrowUpLeft } from 'lucide-react';
export default function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><div><div className="footer-brand"><Gem size={25} /> أسعار الذهب مصر</div><p>صورة أوضح لقيمة الذهب.<br />أسعار استرشادية وأدوات بسيطة، في مكان واحد.</p></div>
      <div><h3>اكتشف الموقع</h3><Link href="/">أسعار الذهب اليوم</Link><Link href="/calculator/">حاسبة الذهب <ArrowUpLeft size={14} /></Link><Link href="/converter/">تحويل العيارات</Link><Link href="/articles/">الأخبار والمقالات</Link></div>
      <div><h3>الشفافية أولاً</h3><Link href="/methodology/">كيف نحسب الأسعار؟</Link><Link href="/about/">من نحن</Link><Link href="/contact/">تواصل معنا</Link><Link href="/disclaimer/">إخلاء المسؤولية</Link></div>
      <div className="footer-note"><span>قبل أن تشتري</span><p>قارن المصنعية وتحقق من الوزن والدمغة، واطلب فاتورة مفصلة. الأسعار هنا لا تمثل عرض بيع أو شراء.</p></div>
    </div><div className="footer-base"><span>© {new Date().getFullYear()} أسعار الذهب مصر</span><div><Link href="/privacy-policy/">الخصوصية</Link><Link href="/terms/">شروط الاستخدام</Link></div><span>صُنع لمتابعي الذهب في مصر</span></div>
  </div></footer>;
}
