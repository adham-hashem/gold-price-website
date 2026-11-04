import { NextRequest, NextResponse } from 'next/server';
import { desc, eq, gte, lt } from 'drizzle-orm';
import { createHmac } from 'node:crypto';
import { getDb } from '@/db';
import { incrementLoginAttempt, saveSetting, updateArticle } from '@/db/operations';
import { articles, loginAttempts, priceHistory, settings } from '@/db/schema';
import { createSession, matchesPassword, SESSION_COOKIE, SESSION_SECONDS, validSession } from '@/lib/server/auth';
import { articleInput, cleanContent, settingInput } from '@/lib/server/content';
import { fetchArticles, fetchArticleBySlug } from '@/lib/server/articles';
import { fetchServerPrices } from '@/lib/server/prices';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
type Context = { params: Promise<{ path: string[] }> };
const response = (data: unknown, status = 200) => NextResponse.json(data, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
});
const allowedSettings = ['usd-egp-rate', 'ounce-offset'];
const sessionOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/' };

async function handle(req: NextRequest, context: Context) {
  const path = (await context.params).path.join('/');
  const method = req.method;
  try {
    // All browser mutations must originate from this host (including login/logout).
    if (method !== 'GET') {
      const origin = req.headers.get('origin');
      if (!origin || origin !== req.nextUrl.origin) return response({ error: 'Invalid request origin' }, 403);
    }
    if (method === 'POST' && path === 'auth/logout') {
      const res = response({ success: true });
      res.cookies.set(SESSION_COOKIE, '', { ...sessionOptions, maxAge: 0 });
      return res;
    }
    if (method === 'GET' && path === 'auth/session') {
      return response({ authenticated: validSession(req.cookies.get(SESSION_COOKIE)?.value) });
    }
    if (method === 'GET' && path === 'cron/snapshot') {
      const secret = process.env.CRON_SECRET;
      if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return response({ error: 'Unauthorized' }, 401);
      const day = new Date(); day.setUTCHours(0, 0, 0, 0);
      const [existing] = await getDb().select({ id: priceHistory.id }).from(priceHistory).where(gte(priceHistory.timestamp, day)).limit(1);
      if (existing) return response({ success: true, skipped: true });
      const quote = await fetchServerPrices();
      await getDb().insert(priceHistory).values({ karat24: quote.karat24, karat21: quote.karat21, karat18: quote.karat18, ounceUSD: quote.ounceUSD });
      return response({ success: true });
    }
    if (path.startsWith('admin/') && !validSession(req.cookies.get(SESSION_COOKIE)?.value)) return response({ error: 'Unauthorized' }, 401);
    let body: unknown;
    if (method === 'POST' || method === 'PUT') {
      if (!req.headers.get('content-type')?.includes('application/json')) return response({ error: 'JSON required' }, 415);
      if (Number(req.headers.get('content-length') || 0) > 200000) return response({ error: 'Request too large' }, 413);
      const text = await req.text();
      if (Buffer.byteLength(text) > 200000) return response({ error: 'Request too large' }, 413);
      try { body = JSON.parse(text); } catch { return response({ error: 'Invalid JSON' }, 400); }
    }
    if (method === 'POST' && path === 'auth/login') {
      // Validate configuration before using it for throttling or authentication.
      matchesPassword('');
      const password = (body as { password?: unknown })?.password;
      if (typeof password !== 'string' || password.length > 1024) return response({ error: 'Invalid password' }, 400);
      // Vercel overwrites x-vercel-forwarded-for; do not trust client-controlled x-forwarded-for.
      const ip = process.env.VERCEL ? req.headers.get('x-vercel-forwarded-for') || 'unknown' : 'local';
      const windowId = Math.floor(Date.now() / 900000);
      const key = createHmac('sha256', process.env.JWT_SECRET!).update(`${ip}:${windowId}`).digest('hex');
      const db = getDb();
      await db.delete(loginAttempts).where(lt(loginAttempts.expiresAt, new Date()));
      const attempts = await incrementLoginAttempt(db, key, new Date((windowId + 1) * 900000));
      if (attempts > 10) {
        const res = response({ error: 'محاولات كثيرة. حاول مرة أخرى بعد 15 دقيقة.' }, 429);
        res.headers.set('Retry-After', '900'); return res;
      }
      if (!matchesPassword(password)) return response({ error: 'كلمة المرور غير صحيحة' }, 401);
      const res = response({ success: true });
      res.cookies.set(SESSION_COOKIE, createSession(), { ...sessionOptions, maxAge: SESSION_SECONDS });
      return res;
    }
    if (method === 'GET' && path === 'prices') {
      try { return response(await fetchServerPrices()); }
      catch { return response({ error: 'تعذر تحديث الأسعار من المصدر. حاول مرة أخرى قريباً.' }, 503); }
    }
    if (method === 'GET' && path === 'articles') return response(await fetchArticles());
    if (method === 'GET' && path.startsWith('articles/')) {
      const article = await fetchArticleBySlug(path.slice('articles/'.length));
      return article ? response(article) : response({ error: 'Article not found' }, 404);
    }
    if (method === 'GET' && path === 'settings/all') {
      return response((await getDb().select().from(settings)).filter(s => allowedSettings.includes(s.key)));
    }
    if (method === 'GET' && path.startsWith('settings/')) {
      const key = path.slice('settings/'.length);
      if (!allowedSettings.includes(key)) return response({ error: 'Not found' }, 404);
      const [row] = await getDb().select().from(settings).where(eq(settings.key, key));
      return response({ key, value: row?.value || '' });
    }
    if (method === 'GET' && path === 'price-history') {
      const rows = await getDb().select().from(priceHistory).orderBy(desc(priceHistory.timestamp)).limit(30);
      return response(rows.reverse());
    }
    if (method === 'POST' && path === 'admin/settings') {
      const parsed = settingInput.safeParse(body);
      if (!parsed.success) return response({ error: 'Invalid setting value' }, 400);
      await saveSetting(getDb(), parsed.data.key, parsed.data.value);
      revalidateTag('gold-quote', { expire: 0 });
      return response({ success: true });
    }
    if ((path === 'admin/articles' && method === 'POST') || (/^admin\/articles\/\d+$/.test(path) && method === 'PUT')) {
      const parsed = articleInput.safeParse(body);
      if (!parsed.success) return response({ error: 'راجع العنوان والرابط والأسعار ومحتوى المقال.' }, 400);
      const values = { ...parsed.data, content: cleanContent(parsed.data.content) };
      if (values.content.replace(/<[^>]*>/g, '').trim().length < 20) return response({ error: 'Article content is too short' }, 400);
      if (method === 'POST') await getDb().insert(articles).values({ ...values, isPublished: true });
      else {
        const id = Number(path.split('/')[2]);
        if (!Number.isSafeInteger(id) || id < 1) return response({ error: 'Invalid ID' }, 400);
        const [existing] = await getDb().select({ id: articles.id }).from(articles).where(eq(articles.id, id)).limit(1);
        if (!existing) return response({ error: 'Article not found' }, 404);
        await updateArticle(getDb(), id, values);
      }
      return response({ success: true });
    }
    if (/^admin\/articles\/\d+$/.test(path) && method === 'DELETE') {
      const id = Number(path.split('/')[2]);
      if (!Number.isSafeInteger(id) || id < 1) return response({ error: 'Invalid ID' }, 400);
      await getDb().delete(articles).where(eq(articles.id, id));
      return response({ success: true });
    }
    return response({ error: 'Not found' }, 404);
  } catch (error) {
    const code = (error as { cause?: { code?: string }; code?: string }).cause?.code || (error as { code?: string }).code;
    if (code === '23505') return response({ error: 'رابط المقال مستخدم بالفعل.' }, 409);
    console.error('API request failed:', path, code || 'configuration or database unavailable');
    return response({ error: 'الخدمة غير متاحة مؤقتاً. تحقق من إعدادات قاعدة البيانات والخادم.' }, 503);
  }
}
export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
