import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'gold_admin';
export const SESSION_SECONDS = 60 * 60 * 8;

function signingKey() {
  const secret = process.env.JWT_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < 32 || !password || password.length < 16) {
    throw new Error('Set ADMIN_PASSWORD (16+ characters) and JWT_SECRET (32+ characters)');
  }
  // Changing either credential invalidates every existing session.
  return createHmac('sha256', secret).update(password).digest();
}
export function matchesPassword(value: string) {
  signingKey();
  return timingSafeEqual(createHash('sha256').update(value).digest(),
    createHash('sha256').update(process.env.ADMIN_PASSWORD!).digest());
}
export function createSession(now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Math.floor(now / 1000) + SESSION_SECONDS })).toString('base64url');
  return `${payload}.${createHmac('sha256', signingKey()).update(payload).digest('base64url')}`;
}
export function validSession(token: string | undefined, now = Date.now()) {
  if (!token || token.length > 2048) return false;
  try {
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return false;
    const actual = Buffer.from(signature, 'base64url');
    const expected = createHmac('sha256', signingKey()).update(payload).digest();
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.role === 'admin' && Number.isFinite(data.exp) && data.exp > now / 1000;
  } catch { return false; }
}
