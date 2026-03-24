'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    GoldPrices,
    fetchGoldPrices,
    calculateGoldValue,
    getCraftsmanshipEstimates,
    formatPrice,
} from '@/lib/goldService';
import AdSlot from '@/components/AdSlot';

const KARATS = [24, 22, 21, 18, 14];

export default function CalculatorClient() {
    const [prices, setPrices] = useState<GoldPrices | null>(null);
    const [weight, setWeight] = useState<string>('1');
    const [selectedKarat, setSelectedKarat] = useState<number>(21);
    const [craftsmanship, setCraftsmanship] = useState<number>(60);

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

    const craftsmanshipRanges = getCraftsmanshipEstimates();
    const currentRange = craftsmanshipRanges.find((c) => c.karat === selectedKarat);

    const weightNum = parseFloat(weight) || 0;
    const result = prices
        ? calculateGoldValue(weightNum, selectedKarat, prices.karat24, craftsmanship)
        : null;

    return (
        <div className="container page-content">
            <div className="tool-page">
                <div className="tool-header">
                    <h1>
                        🧮 <span className="gold-text">حاسبة سعر الذهب</span> والمصنعية
                    </h1>
                    <p>
                        احسب سعر الذهب مع المصنعية لأي وزن وعيار بناءً على الأسعار المحدثة لحظياً
                    </p>
                </div>

                <AdSlot type="banner" id="ad-calc-top" />

                <div className="tool-card card">
                    {/* Weight Input */}
                    <div className="form-group">
                        <label className="form-label">⚖️ الوزن بالجرام</label>
                        <input
                            type="number"
                            className="form-input"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="أدخل الوزن بالجرام"
                            min="0"
                            step="0.1"
                            id="weight-input"
                        />
                    </div>

                    {/* Karat Selector */}
                    <div className="form-group">
                        <label className="form-label">💎 عيار الذهب</label>
                        <div className="karat-selector">
                            {KARATS.map((k) => (
                                <button
                                    key={k}
                                    className={`karat-btn ${selectedKarat === k ? 'selected' : ''}`}
                                    onClick={() => setSelectedKarat(k)}
                                    id={`karat-btn-${k}`}
                                >
                                    {k}K
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Craftsmanship Slider */}
                    <div className="slider-group">
                        <div className="slider-header">
                            <label className="form-label">🔨 المصنعية للجرام</label>
                            <span className="slider-value">{formatPrice(craftsmanship)} ج.م</span>
                        </div>
                        <input
                            type="range"
                            className="slider"
                            min={currentRange?.minPerGram || 30}
                            max={currentRange?.maxPerGram || 150}
                            value={craftsmanship}
                            onChange={(e) => setCraftsmanship(parseInt(e.target.value))}
                            id="craftsmanship-slider"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span>{currentRange?.minPerGram || 30} ج.م (حد أدنى)</span>
                            <span>{currentRange?.maxPerGram || 150} ج.م (حد أقصى)</span>
                        </div>
                    </div>

                    {/* Results */}
                    {result && prices && (
                        <div className="result-card animate-fadeIn">
                            <div className="result-row">
                                <span className="result-label">سعر الجرام عيار {selectedKarat}</span>
                                <span className="result-value">
                                    {formatPrice(Math.round(prices.karat24 * (selectedKarat / 24)))} ج.م
                                </span>
                            </div>
                            <div className="result-row">
                                <span className="result-label">قيمة الذهب ({weightNum} جرام)</span>
                                <span className="result-value">{formatPrice(result.goldValue)} ج.م</span>
                            </div>
                            <div className="result-row">
                                <span className="result-label">المصنعية ({weightNum} جرام × {craftsmanship} ج.م)</span>
                                <span className="result-value">{formatPrice(result.craftsmanshipCost)} ج.م</span>
                            </div>
                            <div className="result-row">
                                <span className="result-label">💰 الإجمالي التقريبي</span>
                                <span className="result-total">{formatPrice(result.totalValue)} ج.م</span>
                            </div>
                        </div>
                    )}

                    {!prices && (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                            جاري تحميل الأسعار...
                        </div>
                    )}
                </div>

                <AdSlot type="inline" id="ad-calc-bottom" />

                {/* Info Section */}
                <div className="card" style={{ marginTop: '24px' }}>
                    <h2 className="section-title" style={{ fontSize: '1.1rem' }}>
                        <span className="icon">💡</span>
                        ملاحظات عن المصنعية
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '2', fontSize: '0.9rem' }}>
                        المصنعية هي تكلفة تشكيل وتصنيع المشغولات الذهبية وتختلف من محل لآخر ومن تصميم لآخر.
                        المصنعية المعروضة هنا تقريبية وتعتمد على متوسط أسعار السوق المصري. المشغولات البسيطة
                        مثل الدبل والخواتم عادةً تكون مصنعيتها أقل، بينما المشغولات المعقدة مثل العقود والأساور
                        المزخرفة تكون مصنعيتها أعلى. يُنصح دائماً بسؤال الصائغ عن المصنعية قبل الشراء.
                    </p>
                </div>
            </div>
        </div>
    );
}
