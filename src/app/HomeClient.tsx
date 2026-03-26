'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { GoldPrices, fetchGoldPrices, formatPrice, formatTime, formatDate } from '@/lib/goldService';
import { Article } from '@/lib/articleService';
import GoldPriceCard from '@/components/GoldPriceCard';
import PriceTicker from '@/components/PriceTicker';
import AdSlot from '@/components/AdSlot';
import ArticleCard from '@/components/ArticleCard';

const REFRESH_INTERVAL = 60000; // 60 seconds

interface HomeClientProps {
  initialPrices: GoldPrices | null;
  latestArticles: Article[];
}

export default function HomeClient({ initialPrices, latestArticles }: HomeClientProps) {
  const [prices, setPrices] = useState<GoldPrices | null>(initialPrices);
  const [loading, setLoading] = useState(!initialPrices);
  const [countdown, setCountdown] = useState(60);

  const loadPrices = useCallback(async () => {
    try {
      const data = await fetchGoldPrices();
      setPrices(data);
    } catch (error) {
      console.error('Failed to load prices:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // We already have initialPrices, so we just set up the interval
    const interval = setInterval(() => {
      loadPrices();
      setCountdown(60);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadPrices]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const karatData = prices
    ? [
      { karat: 24, purity: '999.9', price: prices.karat24, featured: false },
      { karat: 22, purity: '916.7', price: prices.karat22, featured: false },
      { karat: 21, purity: '875.0', price: prices.karat21, featured: true },
      { karat: 18, purity: '750.0', price: prices.karat18, featured: false },
      { karat: 14, purity: '583.3', price: prices.karat14, featured: false },
    ]
    : [];

  return (
    <>
      <PriceTicker prices={prices} />

      <div className="container page-content">
        {/* Hero */}
        <section className="hero">
          <h1>
            <span className="gold-text">أسعار الذهب</span> اليوم في مصر
          </h1>
          <p className="hero-subtitle">
            تابع أسعار الذهب لحظة بلحظة في محلات الصاغة المصرية. أسعار محدثة تلقائياً كل دقيقة.
          </p>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <div className="pulse-dot"></div>
              <span>أسعار مباشرة</span>
            </div>
            {prices && (
              <>
                <div className="hero-meta-item">
                  📅 {formatDate(prices.lastUpdated)}
                </div>
                <div className="hero-meta-item">
                  🕐 آخر تحديث: {formatTime(prices.lastUpdated)}
                </div>
                <div className="hero-meta-item">
                  🔄 تحديث تلقائي بعد {countdown} ثانية
                </div>
              </>
            )}
          </div>
        </section>

        {/* Top Ad Banner */}
        <AdSlot type="banner" id="ad-top-banner" />

        <div className="main-layout">
          <div className="main-content">
            {/* Quick Info */}
            {prices && (
              <div className="quick-info animate-fadeIn">
                <div className="quick-info-item">
                  <div className="quick-info-icon">💰</div>
                  <div className="quick-info-text">
                    <h4>سعر الأونصة بالدولار</h4>
                    <p>${formatPrice(prices.ounceUSD)}</p>
                  </div>
                </div>
                <div className="quick-info-item">
                  <div className="quick-info-icon">🏦</div>
                  <div className="quick-info-text">
                    <h4>سعر الأونصة بالجنيه</h4>
                    <p>{formatPrice(prices.ounceEGP)} ج.م</p>
                  </div>
                </div>
                <div className="quick-info-item">
                  <div className="quick-info-icon">💱</div>
                  <div className="quick-info-text">
                    <h4>سعر الدولار</h4>
                    <p>{prices.usdToEgp.toFixed(2)} ج.م</p>
                  </div>
                </div>
                <div className="quick-info-item">
                  <div className="quick-info-icon">{prices.changePercent24h >= 0 ? '📈' : '📉'}</div>
                  <div className="quick-info-text">
                    <h4>التغير خلال 24 ساعة</h4>
                    <p style={{ color: prices.changePercent24h >= 0 ? 'var(--green-400)' : 'var(--red-400)' }}>
                      {prices.changePercent24h >= 0 ? '+' : ''}{prices.changePercent24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Prices Grid */}
            <section className="prices-section">
              <h2 className="section-title">
                <span className="icon">📊</span>
                أسعار جرام الذهب لجميع العيارات
              </h2>

              {loading ? (
                <div className="prices-grid">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div className="card" key={i}>
                      <div className="loading-skeleton loading-text" style={{ width: '100px', marginBottom: '12px' }}></div>
                      <div className="loading-skeleton loading-price"></div>
                      <div className="loading-skeleton loading-text" style={{ width: '60px', marginTop: '8px' }}></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="prices-grid">
                  {karatData.map((item, index) => (
                    <GoldPriceCard
                      key={item.karat}
                      karat={item.karat}
                      purity={item.purity}
                      price={item.price}
                      changePercent={prices?.changePercent24h || 0}
                      featured={item.featured}
                      delay={index}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Latest Articles Section (New) */}
            {latestArticles.length > 0 && (
                <section className="home-articles" style={{ marginTop: '40px' }}>
                    <h2 className="section-title">
                        <span className="icon">📰</span>
                        أحدث أخبار الذهب
                    </h2>
                    <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {latestArticles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <a href="/articles/" className="tool-link" style={{ display: 'inline-flex' }}>مشاهدة جميع الأخبار ←</a>
                    </div>
                </section>
            )}

            {/* Inline Ad */}
            <AdSlot type="inline" id="ad-inline-1" />

            {/* Ounce Prices */}
            {prices && (
              <section>
                <h2 className="section-title">
                  <span className="icon">🏅</span>
                  سعر أونصة الذهب
                </h2>
                <div className="ounce-section">
                  <div className="card ounce-card animate-fadeInUp" style={{ animationDelay: '0.1s', opacity: 0 }}>
                    <div className="ounce-icon usd">$</div>
                    <div className="ounce-info">
                      <h3>سعر الأونصة بالدولار الأمريكي</h3>
                      <div className="ounce-price">${formatPrice(prices.ounceUSD)}</div>
                    </div>
                  </div>
                  <div className="card ounce-card animate-fadeInUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
                    <div className="ounce-icon egp">£</div>
                    <div className="ounce-info">
                      <h3>سعر الأونصة بالجنيه المصري</h3>
                      <div className="ounce-price">{formatPrice(prices.ounceEGP)} ج.م</div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Gold Guide & SEO Content */}
            <section className="gold-guide-section">
              <div className="card">
                <h2 className="section-title">
                  <span className="icon">📚</span>
                  دليل أسعار الذهب في مصر
                </h2>

                <div className="guide-grid">
                  <div className="guide-item">
                    <h3>تحت أي أساس يتحدد سعر الذهب؟</h3>
                    <p>
                      يتحدد سعر الذهب في السوق المصري بناءً على ثلاثة عوامل رئيسية: السعر العالمي لـ "أوقية الذهب" (الأونصة) بالدولار، سعر صرف الدولار مقابل الجنيه المصري في البنوك والسوق المحلي، بالإضافة إلى حجم العرض والطلب في محلات الصاغة المصرية. نحن نقوم بتحديث هذه العوامل لحظياً لنقدم لك أدق سعر ممكن.
                    </p>
                  </div>

                  <div className="guide-item">
                    <h3>ما الفرق بين عيارات الذهب؟</h3>
                    <p>
                      <strong>عيار 24:</strong> هو الذهب الخالص بنسبة 99.9%، ويستخدم غالباً في السبائك. <br />
                      <strong>عيار 21:</strong> هو العيار الأكثر شيوعاً في مصر للزينة والادخار، ويتميز بتوازن القيمة والصلابة. <br />
                      <strong>عيار 18:</strong> ينتشر في المصوغات ذات التصاميم الفنية المعقدة، ويحتوي على نسبة أعلى من المعادن الأخرى لزيادة القوة.
                    </p>
                  </div>
                </div>

                <div className="faq-section" style={{ marginTop: '32px' }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>الأسئلة الشائعة عن الذهب</h3>

                  <details className="faq-item">
                    <summary>كيف أحسب سعر الذهب بالمصنعية؟</summary>
                    <div className="faq-answer">
                      لحساب السعر النهائي: (وزن الذهب × سعر العيار بدون مصنعية) + (وزن الذهب × سعر المصنعية للجرام). تختلف المصنعية من محل لآخر ومن تصميم لآخر، وغالباً ما تتراوح بين 60 إلى 150 جيه للجرام لعيار 21.
                    </div>
                  </details>

                  <details className="faq-item">
                    <summary>هل الوقت الحالي مناسب لشراء الذهب؟</summary>
                    <div className="faq-answer">
                      الذهب يُعتبر "ملاذ آمن" طويل الأجل. ينصح الخبراء دائماً بالشراء عند حدوث تراجعات في السعر العالمي أو الاستقرار المحلي، وتوزيع مشترياتك على فترات زمنية مختلفة لتقليل مخاطر تقلب الأسعار.
                    </div>
                  </details>

                  <details className="faq-item">
                    <summary>ما هو الجنيه الذهب ومما يتكون؟</summary>
                    <div className="faq-answer">
                      الجنيه الذهب يزن 8 جرامات من عيار 21. وهو من أفضل وسائل الادخار في مصر نظراً لانخفاض مصنعيته مقارنة بالمشغولات الذهبية، وسهولة تسييله (بيعه) في أي وقت.
                    </div>
                  </details>
                </div>
              </div>
            </section>

            {/* Bottom Inline Ad */}
            <AdSlot type="inline" id="ad-inline-2" />
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <AdSlot type="sidebar" id="ad-sidebar-1" />

            {/* Quick Links Card */}
            <div className="card">
              <h3 className="section-title" style={{ fontSize: '1rem' }}>
                <span className="icon">🔗</span>
                أدوات مفيدة
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/calculator/" className="tool-link">
                  🧮 حاسبة سعر الذهب والمصنعية
                </Link>
                <Link href="/converter/" className="tool-link">
                  🔄 تحويل بين عيارات الذهب
                </Link>
                <Link href="/articles/" className="tool-link">
                  📰 أخبار وتحليلات الذهب
                </Link>
              </div>
            </div>

            <AdSlot type="sidebar" id="ad-sidebar-2" />
          </aside>
        </div>
      </div>
    </>
  );
}
