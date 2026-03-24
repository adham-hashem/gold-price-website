'use client';

import React from 'react';
import { GoldPrices, formatPrice } from '@/lib/goldService';

interface PriceTickerProps {
    prices: GoldPrices | null;
}

export default function PriceTicker({ prices }: PriceTickerProps) {
    if (!prices) return null;

    const items = [
        { label: 'عيار 24', price: prices.karat24 },
        { label: 'عيار 22', price: prices.karat22 },
        { label: 'عيار 21', price: prices.karat21 },
        { label: 'عيار 18', price: prices.karat18 },
        { label: 'عيار 14', price: prices.karat14 },
        { label: 'الأونصة (USD)', price: prices.ounceUSD },
    ];

    const isUp = prices.changePercent24h >= 0;

    // Duplicate items for seamless scrolling
    const allItems = [...items, ...items];

    return (
        <div className="price-ticker">
            <div className="ticker-inner">
                {allItems.map((item, i) => (
                    <div className="ticker-item" key={i}>
                        <span className="ticker-label">{item.label}</span>
                        <span className="ticker-price">{formatPrice(item.price)} ج.م</span>
                        <span className={`ticker-change ${isUp ? 'up' : 'down'}`}>
                            {isUp ? '▲' : '▼'} {Math.abs(prices.changePercent24h).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
