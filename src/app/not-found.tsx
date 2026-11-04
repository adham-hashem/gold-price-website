import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container page-content" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--gold-500)', marginBottom: '12px' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>عذراً، الصفحة غير موجودة!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
        يبدو أنك وصلت إلى رابط غير موجود أو تم نقله. يمكنك العودة للصفحة الرئيسية لمتابعة أسعار الذهب.
      </p>
      <Link href="/" className="logo-icon" style={{ width: 'auto', padding: '0 30px', margin: '0 auto', color: 'white' }}>
        العودة للرئيسية
      </Link>
    </div>
  );
}
