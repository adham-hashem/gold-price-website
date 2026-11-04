'use client';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="container page-content"><div className="card" style={{ maxWidth:650,margin:'70px auto',textAlign:'center',padding:40 }}><h1>تعذر تحميل الصفحة حالياً</h1><p style={{ margin:'20px 0' }}>قد تكون هناك مشكلة مؤقتة في الاتصال بالخادم. حاول مرة أخرى بعد قليل.</p><button className="button button-dark" onClick={reset}>إعادة المحاولة</button></div></div>;
}
