import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

export const articleInput = z.object({
  title: z.string().trim().min(3).max(255),
  slug: z.string().trim().min(1).max(200).regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u),
  content: z.string().trim().min(20).max(60000),
  metaDescription: z.string().trim().max(255).nullable().optional(),
  category: z.string().trim().max(100).default('أخبار'),
  showPrices: z.boolean().default(false),
  price24: z.number().positive().max(1e9).nullable().optional(),
  price21: z.number().positive().max(1e9).nullable().optional(),
  price18: z.number().positive().max(1e9).nullable().optional(),
  price14: z.number().positive().max(1e9).nullable().optional(),
  priceGoldPound: z.number().positive().max(1e9).nullable().optional(),
});
export const settingInput = z.object({
  key: z.enum(['usd-egp-rate', 'ounce-offset']),
  value: z.string().trim().max(20),
}).superRefine(({ key, value }, ctx) => {
  if (key === 'usd-egp-rate' && value === '') return;
  const n = Number(value);
  if (value === '' || !Number.isFinite(n) || (key === 'usd-egp-rate' ? n <= 0 || n > 10000 : n < -100 || n > 100)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid exchange rate or market adjustment' });
  }
});
export function cleanContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'blockquote', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    allowedAttributes: { a: ['href', 'title'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
  });
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
