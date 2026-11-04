# Google Search launch checklist

Implemented: Arabic/RTL responsive pages, semantic headings, server-rendered price/article text, descriptive titles and descriptions, page-specific canonicals, crawlable internal links, dynamic published-article sitemap, one robots.txt, admin/API noindex, preview noindex, Article/Breadcrumb/WebSite/Organization structured data, FAQ markup matching visible questions, escaped JSON-LD, sanitized article HTML, generated 1200×630 social preview, self-hosted fonts, no empty ad boxes, source/methodology page, and honest missing/stale-price states.

## After deployment

1. Attach one preferred HTTPS custom domain. Set `NEXT_PUBLIC_SITE_URL` to it and redirect other hostnames to that domain in Vercel. Confirm that canonicals do not point to an old domain or the preview URL.
2. Verify domain ownership in [Google Search Console](https://search.google.com/search-console/). For HTML verification, set `GOOGLE_SITE_VERIFICATION` to the token (not the entire meta element), then redeploy. DNS verification is another option.
3. Open `/sitemap.xml` and confirm that it returns real published article URLs, then submit it in Search Console. Apply the DB schema first; the sitemap intentionally fails when its article database is unavailable, rather than silently pretending there are no articles.
4. Use URL Inspection on the homepage, calculator, converter and an article. Check the rendered HTML and canonical. Use [Rich Results Test](https://search.google.com/test/rich-results) to validate supported structured data. FAQ markup does not guarantee a FAQ search enhancement.
5. Test your production URL on [PageSpeed Insights](https://pagespeed.web.dev/) for mobile and desktop. Watch real-user Core Web Vitals in Search Console. Performance cannot be assessed fully before deployment and traffic.
6. Publish original Arabic articles with clear dates, accurate sources, and named authors whose qualifications you can substantiate. Update reporting when facts change. Do not invent expertise, customer reviews, retail quotes, or financial recommendations.
7. Add the people or organization responsible for the site and an editorial policy to `/about/`. Verify the inherited contact email. For this financial topic, accuracy and trust are essential. The methodology explains how estimates differ from shop quotes.
8. Keep source services healthy. Publish useful content around visitor questions, e.g. how to read a gold invoice, compare workmanship, or distinguish karats. Avoid duplicate pages for every keyword/date with no new information.
9. Monitor indexing, query performance, API failures and broken links. Review price/API quotas as traffic grows. Rank changes are gradual and depend on relevance and competition as well as implementation.

Official references:

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Creating helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Search technical fundamentals](https://developers.google.com/search/docs/fundamentals/get-started)

The code can improve eligibility and clarity; it cannot promise a ranking, an indexing date, or a rich result.
