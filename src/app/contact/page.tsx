import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "تواصل معنا - أسعار الذهب اليوم في مصر",
    description: "تواصل مع فريق موقع أسعار الذهب مصر. نسعد بتلقي استفساراتكم واقتراحاتكم لتحسين تجربتكم.",
    alternates: {
        canonical: "/contact/",
    },
};

export default function ContactPage() {
    return (
        <div className="container page-content">
            <article className="article-post">
                <header className="article-header">
                    <h1>تواصل معنا</h1>
                </header>

                <div className="card article-body">
                    <p>
                        نرحب دائماً بتواصلكم معنا! سواء كان لديكم استفسار حول أسعار الذهب،
                        أو اقتراح لتحسين الموقع، أو ملاحظة تودون مشاركتها — فريقنا جاهز للرد عليكم.
                    </p>

                    <h2>البريد الإلكتروني</h2>
                    <p>
                        يمكنكم مراسلتنا مباشرة على البريد الإلكتروني التالي:
                    </p>
                    <p style={{ direction: "ltr", textAlign: "center", fontSize: "1.1rem" }}>
                        <a href="mailto:goldegy@proton.me" style={{ fontWeight: 600 }}>
                            goldegy@proton.me
                        </a>
                    </p>

                    <h2>وسائل التواصل الاجتماعي</h2>
                    <p>
                        تابعونا على منصات التواصل الاجتماعي للبقاء على اطلاع بآخر تحديثات
                        أسعار الذهب والأخبار الاقتصادية:
                    </p>
                    <ul>
                        <li>فيسبوك: أسعار الذهب مصر</li>
                        <li>تويتر (X): @egyptgoldonline</li>
                    </ul>

                    <h2>ساعات الرد</h2>
                    <p>
                        نحرص على الرد على جميع الرسائل خلال 24-48 ساعة عمل.
                        نشكركم على صبركم وثقتكم بنا.
                    </p>

                    <h2>الإبلاغ عن مشكلة</h2>
                    <p>
                        إذا لاحظتم أي خطأ في الأسعار المعروضة أو واجهتم مشكلة تقنية في الموقع،
                        يرجى مراسلتنا فوراً عبر البريد الإلكتروني مع وصف المشكلة وسنعمل على حلها
                        في أسرع وقت.
                    </p>
                </div>
            </article>
        </div>
    );
}
