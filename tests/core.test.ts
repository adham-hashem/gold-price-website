import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession, validSession, matchesPassword } from '../src/lib/server/auth';
import { articleInput, cleanContent, jsonLd, settingInput } from '../src/lib/server/content';
import { derivePrices } from '../src/lib/server/prices';
import { calculateGoldValue, convertKarat } from '../src/lib/goldService';
process.env.ADMIN_PASSWORD = 'test-only-long-admin-password';
process.env.JWT_SECRET = 'test-only-signing-key-with-at-least-32-characters';

test('admin session rejects tampering, expires, and is revoked by credential rotation', () => {
  const now = Date.now();
  const token = createSession(now);
  assert.equal(validSession(token, now), true);
  assert.equal(validSession(token + '.extra', now), false);
  assert.equal(validSession(token.slice(1), now), false);
  assert.equal(validSession(token, now + 8 * 60 * 60 * 1000), false);
  assert.equal(matchesPassword(process.env.ADMIN_PASSWORD!), true);
  assert.equal(matchesPassword('wrong'), false);
  const password = process.env.ADMIN_PASSWORD!;
  process.env.ADMIN_PASSWORD = 'rotated-test-admin-password';
  assert.equal(validSession(token, now), false);
  process.env.ADMIN_PASSWORD = password;
});

test('article HTML cannot execute scripts or inject unsafe URLs', () => {
  const html = cleanContent('<h2>Gold</h2><script>alert(1)</script><p onclick="alert(1)">Price</p><a href="javascript:alert(1)">bad</a><img src=x onerror="alert(1)"><iframe src="https://example.com"></iframe>');
  assert.match(html, /<h2>Gold<\/h2>/);
  assert.doesNotMatch(html, /script|onclick|javascript:|onerror|iframe|<img/i);
  assert.equal(jsonLd({ title: '</script><script>alert(1)</script>' }).includes('<'), false);
  assert.equal(JSON.parse(jsonLd({ title: '</script>' })).title, '</script>');
});

test('article/setting validation rejects invalid prices and path-like slugs', () => {
  const input = { title: 'Gold market', slug: 'gold-today', content: '<p>Some useful original article content.</p>' };
  assert.equal(articleInput.safeParse(input).success, true);
  assert.equal(articleInput.safeParse({ ...input, slug: 'أسعار-الذهب' }).success, true);
  assert.equal(articleInput.safeParse({ ...input, slug: '../admin' }).success, false);
  assert.equal(articleInput.safeParse({ ...input, price21: -1 }).success, false);
  assert.equal(settingInput.safeParse({ key: 'JWT_SECRET', value: 'x' }).success, false);
  assert.equal(settingInput.safeParse({ key: 'usd-egp-rate', value: '' }).success, true);
  assert.equal(settingInput.safeParse({ key: 'usd-egp-rate', value: 'NaN' }).success, false);
});

test('gold pricing respects troy ounces, karat purity, pound weight, and market adjustment', () => {
  const quote = derivePrices(31.1034768 * 100, 50, 2, 1.015, new Date('2026-01-01T00:00:00Z'));
  assert.equal(quote.karat24, 5278);
  assert.equal(quote.karat21, Math.round(5278 * 21 / 24));
  assert.equal(quote.goldPound, Math.round(5278 * 21 / 24 * 8));
  assert.equal(quote.changePercent24h, null);
  assert.throws(() => derivePrices(0, 50, 0, 1.015, new Date()));
  assert.throws(() => derivePrices(100, 50, -51, 1.015, new Date()));
});

test('calculator adds workmanship and converter preserves pure gold weight', () => {
  assert.deepEqual(calculateGoldValue(8, 21, 4000, 100), { goldValue: 28000, craftsmanshipCost: 800, totalValue: 28800 });
  assert.equal(convertKarat(12, 18, 24), 9);
  assert.equal(convertKarat(8, 21, 18), 9.333);
  assert.throws(() => convertKarat(1, 21, 0));
  assert.throws(() => calculateGoldValue(-1, 21, 4000));
});
