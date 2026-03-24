'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    GoldPrices,
    fetchGoldPrices,
    convertKarat,
    formatPrice,
} from '@/lib/goldService';
import AdSlot from '@/components/AdSlot';

const KARATS = [24, 22, 21, 18, 14];

export default function ConverterClient() {
    const [prices, setPrices] = useState<GoldPrices | null>(null);
    const [weight, setWeight] = useState<string>('10');
    const [fromKarat, setFromKarat] = useState<number>(21);
    const [toKarat, setToKarat] = useState<number>(18);

    const loadPrices = useCallback(async () => {
        try {
            const data = await fetchGoldPrices();
            setPrices(data);
        } catch (error) {
            console.error('Failed to load prices:', error);
        }
    }, []);

    useEffect(() => {
        loadPrices();
    }, [loadPrices]);

    const weightNum = parseFloat(weight) || 0;
    const convertedWeight = convertKarat(weightNum, fromKarat, toKarat);

    const fromPrice = prices ? Math.round(prices.karat24 * (fromKarat / 24)) : 0;
    const toPrice = prices ? Math.round(prices.karat24 * (toKarat / 24)) : 0;

    const fromValue = weightNum * fromPrice;
    const toValue = convertedWeight * toPrice;

    const handleSwap = () => {
        setFromKarat(toKarat);
        setToKarat(fromKarat);
    };

    return (
        <div className="container page-content">
            <div className="tool-page">
                <div className="tool-header">
                    <h1>
                        🔄 <span className="gold-text">تحويل بين عيارات</span> الذهب
                    </h1>
                    <p>
                        حوّل بين عيارات الذهب المختلفة واعرف الفرق في الوزن والقيمة
                    </p>
                </div>

                <AdSlot type="banner" id="ad-conv-top" />

                <div className="tool-card card">
                    {/* From Karat */}
                    <div className="form-group">
                        <label className="form-label">📤 من عيار</label>
                        <div className="karat-selector">
                            {KARATS.map((k) => (
                                <button
                                    key={k}
                                    className={`karat-btn ${fromKarat === k ? 'selected' : ''}`}
                                    onClick={() => setFromKarat(k)}
                                    id={`from-karat-${k}`}
                                >
                                    {k}K
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Weight Input */}
                    <div className="form-group">
                        <label className="form-label">⚖️ الوزن بالجرام (عيار {fromKarat})</label>
                        <input
                            type="number"
                            className="form-input"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="أدخل الوزن بالجرام"
                            min="0"
                            step="0.1"
                            id="converter-weight-input"
                        />
                    </div>

                    {/* Swap Button */}
                    <div className="converter-arrow">
                        <button onClick={handleSwap} title="تبديل العيارات" id="swap-btn">
                            ⇅
                        </button>
                    </div>

                    {/* To Karat */}
                    <div className="form-group">
                        <label className="form-label">📥 إلى عيار</label>
                        <div className="karat-selector">
                            {KARATS.map((k) => (
                                <button
                                    key={k}
                                    className={`karat-btn ${toKarat === k ? 'selected' : ''}`}
                                    onClick={() => setToKarat(k)}
                                    id={`to-karat-${k}`}
                                >
                                    {k}K
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="result-card animate-fadeIn">
                        <div className="result-row">
                            <span className="result-label">الوزن الأصلي (عيار {fromKarat})</span>
                            <span className="result-value">{weightNum} جرام</span>
                        </div>
                        <div className="result-row">
                            <span className="result-label">الوزن المكافئ (عيار {toKarat})</span>
                            <span className="result-total">{convertedWeight} جرام</span>
                        </div>
                        {prices && (
                            <>
                                <div className="result-row">
                                    <span className="result-label">قيمة عيار {fromKarat} ({weightNum} جم)</span>
                                    <span className="result-value">{formatPrice(Math.round(fromValue))} ج.م</span>
                                </div>
                                <div className="result-row">
                                    <span className="result-label">قيمة عيار {toKarat} ({convertedWeight} جم)</span>
                                    <span className="result-value">{formatPrice(Math.round(toValue))} ج.م</span>
                                </div>
                                <div className="result-row">
                                    <span className="result-label">فرق القيمة</span>
                                    <span className="result-value" style={{
                                        color: toValue >= fromValue ? 'var(--green-400)' : 'var(--red-400)'
                                    }}>
                                        {toValue >= fromValue ? '+' : ''}{formatPrice(Math.round(toValue - fromValue))} ج.م
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <AdSlot type="inline" id="ad-conv-bottom" />

                {/* Info */}
                <div className="card" style={{ marginTop: '24px' }}>
                    <h2 className="section-title" style={{ fontSize: '1.1rem' }}>
                        <span className="icon">💡</span>
                        فهم عيارات الذهب
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '2', fontSize: '0.9rem' }}>
                        عيار الذهب يعبر عن نسبة نقاء الذهب في السبيكة أو المشغولة. عيار 24 هو الذهب الخالص (99.99% نقاء)،
                        بينما عيار 21 يحتوي على 87.5% ذهب خالص والباقي معادن أخرى تضاف لتقوية الذهب وجعله أكثر صلابة.
                        عيار 21 هو الأكثر شيوعاً في مصر ومنطقة الشرق الأوسط لأنه يوفر توازناً جيداً بين النقاء والمتانة.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '16px' }}>
                        {[
                            { karat: 24, purity: '99.99%' },
                            { karat: 22, purity: '91.67%' },
                            { karat: 21, purity: '87.50%' },
                            { karat: 18, purity: '75.00%' },
                            { karat: 14, purity: '58.33%' },
                        ].map((item) => (
                            <div key={item.karat} style={{
                                padding: '12px',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-sm)',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-gold)' }}>
                                    {item.karat}K
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    نقاء {item.purity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
