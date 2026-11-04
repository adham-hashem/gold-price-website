'use client';

import React from 'react';
import { formatPrice } from '@/lib/goldService';

interface GoldPriceCardProps {
    karat: number;
    purity: string;
    price: number;
    changePercent: number;
    featured?: boolean;
    delay?: number;
}

export default function GoldPriceCard({
    karat,
    purity,
    price,
    changePercent,
    featured = false,
    delay = 0,
}: GoldPriceCardProps) {
    const isUp = changePercent >= 0;

    return (
        <div
            className={`card price-card animate-fadeInUp ${featured ? 'card-featured' : ''}`}
            style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
        >
            <div className="price-card-header">
                <div className="karat-badge">
                    <span className="karat-num">{karat}K</span>
                    <span>عيار {karat}</span>
                </div>
                <span className="purity-tag">{purity}</span>
            </div>

            <div className="price-value">
                {formatPrice(price)}
                <span className="currency">ج.م</span>
            </div>
            <div className="price-unit">سعر الجرام</div>

            <div className={`price-change ${isUp ? 'up' : 'down'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
            </div>
        </div>
    );
}
