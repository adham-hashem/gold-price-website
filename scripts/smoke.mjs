// Smoke-test a running local production server without requiring database credentials.
// Run: node scripts/smoke.mjs http://localhost:3100
import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://localhost:3100';
for (const route of ['/', '/calculator/', '/converter/', '/methodology/', '/about/', '/contact/', '/privacy-policy/', '/terms/', '/disclaimer/', '/admin/', '/robots.txt', '/manifest.json', '/opengraph-image']) {
  const response = await fetch(origin + route);
  assert.equal(response.status, 200, route);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', route);
  if (route === '/opengraph-image') assert.match(response.headers.get('content-type') || '', /image\/png/);
  if (['/', '/calculator/', '/converter/', '/methodology/'].includes(route)) {
    const html = await response.text();
    assert.match(html, /lang="ar"/);
    assert.match(html, /dir="rtl"/);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /application\/ld\+json/);
    assert.doesNotMatch(html, /SearchAction|search_term_string/);
  }
  console.log('PASS ' + route);
}
let response = await fetch(origin + '/api/auth/session/');
assert.deepEqual(await response.json(), { authenticated: false });
response = await fetch(origin + '/api/admin/articles/', { method:'POST', headers:{ origin,'content-type':'application/json' }, body:'{}' });
assert.equal(response.status, 401);
response = await fetch(origin + '/api/auth/login/', { method:'POST', headers:{ origin:'https://attacker.invalid','content-type':'application/json' }, body:'{}' });
assert.equal(response.status, 403);
response = await fetch(origin + '/api/cron/snapshot/');
assert.equal(response.status, 401);
response = await fetch(origin + '/does-not-exist/');
assert.equal(response.status, 404);
console.log('PASS API authorization, same-origin checks, cron protection and real 404');
console.log('Database-backed articles, sitemap and successful login need a configured Supabase PostgreSQL database.');
