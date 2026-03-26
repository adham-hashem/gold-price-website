'use client';

import React, { useMemo } from 'react';

interface PricePoint {
    timestamp: string;
    karat21: number;
}

interface SimplePriceChartProps {
    data: PricePoint[];
}

export default function SimplePriceChart({ data }: SimplePriceChartProps) {
    if (!data || data.length < 2) {
        return (
            <div className="card" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <p>لا يوجد بيانات كافية لعرض الرسم البياني حالياً</p>
            </div>
        );
    }

    const { points, min, max } = useMemo(() => {
        const prices = data.map(d => d.karat21);
        const minPrice = Math.min(...prices) * 0.99;
        const maxPrice = Math.max(...prices) * 1.01;
        const range = maxPrice - minPrice;

        const width = 1000;
        const height = 300;
        const padding = 40;

        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const pts = data.map((d, i) => {
            const x = padding + (i / (data.length - 1)) * chartWidth;
            const y = height - padding - ((d.karat21 - minPrice) / range) * chartHeight;
            return `${x},${y}`;
        }).join(' ');

        return { points: pts, min: Math.min(...prices), max: Math.max(...prices) };
    }, [data]);

    return (
        <div className="card price-chart-container animate-fadeIn">
            <div className="chart-header">
                <h3>📈 اتجاه سعر عيار 21</h3>
                <div className="chart-legend">
                    <span className="min">الأدنى: {Math.floor(min)}</span>
                    <span className="max">الأعلى: {Math.floor(max)}</span>
                </div>
            </div>
            <svg viewBox="0 0 1000 300" className="price-chart-svg">
                {/* Grid Lines */}
                <line x1="40" y1="40" x2="40" y2="260" stroke="var(--border-color)" strokeWidth="1" />
                <line x1="40" y1="260" x2="960" y2="260" stroke="var(--border-color)" strokeWidth="1" />
                
                {/* Horizontal guide lines */}
                <line x1="40" y1="150" x2="960" y2="150" stroke="var(--border-color)" strokeDasharray="5,5" opacity="0.3" />
                
                {/* The Path */}
                <polyline
                    fill="none"
                    stroke="var(--gold-500)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />
                
                {/* Area under the curve */}
                <polyline
                    fill="url(#chart-gradient)"
                    opacity="0.1"
                    points={`40,260 ${points} 960,260`}
                />

                <defs>
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--gold-500)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="chart-footer">
                <p>توضيح تقريبي لتقلبات السعر خلال الفترة الأخيرة</p>
            </div>
            
            <style jsx>{`
                .price-chart-container { padding: 20px; }
                .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .chart-header h3 { font-size: 1rem; margin: 0; }
                .chart-legend { display: flex; gap: 12px; font-size: 0.8rem; font-weight: 700; }
                .chart-legend .min { color: var(--red-400); }
                .chart-legend .max { color: var(--green-400); }
                .price-chart-svg { width: 100%; height: auto; transition: all 0.5s; overflow: visible; }
                .chart-footer { margin-top: 12px; font-size: 0.75rem; color: var(--text-muted); text-align: center; }
            `}</style>
        </div>
    );
}
