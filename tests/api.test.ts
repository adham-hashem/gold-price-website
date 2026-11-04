import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '../src/app/api/[...path]/route';
import { createSession } from '../src/lib/server/auth';
const context = (path: string) => ({ params: Promise.resolve({ path: path.split('/') }) });

test('anonymous clients cannot mutate articles/settings, including legacy bearer tokens', async () => {
  for (const [path, method, handle] of [['admin/articles', 'POST', POST], ['admin/articles/1', 'PUT', PUT], ['admin/articles/1', 'DELETE', DELETE], ['admin/settings', 'POST', POST]] as const) {
    const request = new NextRequest('http://localhost/api/' + path, { method, headers: { host: 'localhost', origin: 'http://localhost', authorization: 'Bearer forged' } });
    assert.equal((await handle(request, context(path))).status, 401);
  }
});

test('cross-origin login and logout are rejected before reading any database', async () => {
  for (const path of ['auth/login', 'auth/logout']) {
    const request = new NextRequest('http://localhost/api/' + path, { method: 'POST', headers: { host: 'localhost', origin: 'https://attacker.invalid' } });
    assert.equal((await POST(request, context(path))).status, 403);
  }
});

test('session and cron do not grant anonymous access', async () => {
  const session = await GET(new NextRequest('http://localhost/api/auth/session/'), context('auth/session'));
  assert.deepEqual(await session.json(), { authenticated: false });
  assert.equal(session.headers.get('cache-control'), 'no-store');
  assert.equal((await GET(new NextRequest('http://localhost/api/cron/snapshot/'), context('cron/snapshot'))).status, 401);
});

test('valid cookie authenticates but does not bypass input validation', async () => {
  process.env.ADMIN_PASSWORD = 'test-only-long-admin-password';
  process.env.JWT_SECRET = 'test-only-signing-key-with-at-least-32-characters';
  const token = createSession();
  const request = new NextRequest('http://localhost/api/admin/articles/', {
    method: 'POST', headers: { origin: 'http://localhost', cookie: `gold_admin=${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ title: 'bad', slug: '../admin', content: 'bad' }),
  });
  assert.equal((await POST(request, context('admin/articles'))).status, 400);
  const session = await GET(new NextRequest('http://localhost/api/auth/session/', { headers: { cookie: `gold_admin=${token}` } }), context('auth/session'));
  assert.deepEqual(await session.json(), { authenticated: true });
});

test('logout expires the HttpOnly session and null origins are rejected', async () => {
  const denied = await POST(new NextRequest('http://localhost/api/auth/login/', { method:'POST', headers:{ origin:'null' } }), context('auth/login'));
  assert.equal(denied.status, 403);
  const logout = await POST(new NextRequest('http://localhost/api/auth/logout/', { method:'POST', headers:{ origin:'http://localhost' } }), context('auth/logout'));
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie') || '', /HttpOnly/);
  assert.match(logout.headers.get('set-cookie') || '', /Max-Age=0/);
});
