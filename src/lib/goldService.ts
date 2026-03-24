// Gold Price Service - Fetches live gold prices from free APIs
// Primary: goldprice.org internal API (no API key needed)
// Calculates Egyptian market prices for all karats

export interface GoldPrices {
    karat24: number;
    karat22: number;
    karat21: number;
    karat18: number;
    karat14: number;
    ounceUSD: number;
    ounceEGP: number;
    usdToEgp: number;
    lastUpdated: Date;
    change24h: number;
    changePercent24h: number;
}

export interface CraftsmanshipEstimate {
    karat: number;
    minPerGram: number;
    maxPerGram: number;
}

// Egyptian market markup over spot price (approx 1-3%)
const EGYPT_MARKET_MARKUP = Number(process.env.NEXT_PUBLIC_MARKET_MARKUP) || 1.015;

// Karat purity ratios
const KARAT_PURITY: Record<number, number> = {
    24: 24 / 24,
    22: 22 / 24,
    21: 21 / 24,
    18: 18 / 24,
    14: 14 / 24,
};

// Craftsmanship cost ranges per gram (in EGP) - approximate Egyptian market
const CRAFTSMANSHIP_RANGES: Record<number, { min: number; max: number }> = {
    24: { min: 30, max: 80 },
    22: { min: 40, max: 100 },
    21: { min: 45, max: 120 },
    18: { min: 50, max: 150 },
    14: { min: 30, max: 80 },
};

// Troy ounce to grams
const TROY_OUNCE_GRAMS = 31.1035;

let cachedPrices: GoldPrices | null = null;

export async function fetchGoldPrices(): Promise<GoldPrices> {
    try {
        // Step 1: Get USD to EGP exchange rate (CORS-enabled, no key)
        const fxResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!fxResponse.ok) throw new Error('Exchange rate API failed');
        const fxData = await fxResponse.json();
        const usdToEgp = fxData.rates.EGP || (Number(process.env.NEXT_PUBLIC_USD_EGP_RATE) || 50.5);

        // Step 2: Get Gold Spot Price in USD via Binance PAXG (CORS-enabled, no key)
        // PAXG is a crypto asset pegged 1:1 to a troy ounce of gold
        const goldResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        if (!goldResponse.ok) throw new Error('Binance Gold API failed');
        const goldData = await goldResponse.json();
        const ounceUSD = parseFloat(goldData.price);

        if (!ounceUSD) throw new Error('Invalid gold price data');

        // Step 3: Calculate Egyptian market prices
        const goldOunceEGP = ounceUSD * usdToEgp;
        const pricePerGram24K = (goldOunceEGP / TROY_OUNCE_GRAMS) * EGYPT_MARKET_MARKUP;

        const prices: GoldPrices = {
            karat24: Math.round(pricePerGram24K),
            karat22: Math.round(pricePerGram24K * KARAT_PURITY[22]),
            karat21: Math.round(pricePerGram24K * KARAT_PURITY[21]),
            karat18: Math.round(pricePerGram24K * KARAT_PURITY[18]),
            karat14: Math.round(pricePerGram24K * KARAT_PURITY[14]),
            ounceUSD: Math.round(ounceUSD * 100) / 100,
            ounceEGP: Math.round(goldOunceEGP),
            usdToEgp: Math.round(usdToEgp * 100) / 100,
            lastUpdated: new Date(),
            change24h: 0, // Binance ticker doesn't provide 24h change in this simple endpoint
            changePercent24h: 0,
        };

        cachedPrices = prices;
        return prices;
    } catch (error) {
        console.error('Error fetching gold prices:', error);

        // Try fallback to gold-api.com (which we saw works in some regions but might have CORS)
        try {
            return await fetchGoldPricesFallback();
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            if (cachedPrices) return cachedPrices;
            return getDemoPrices();
        }
    }
}

async function fetchGoldPricesFallback(): Promise<GoldPrices> {
    // Fallback: gold-api.com (CORS enabled)
    const response = await fetch('https://api.gold-api.com/price/XAU');
    if (!response.ok) throw new Error('Gold-API.com failed');

    const data = await response.json();
    let ounceUSD = data.price;

    // If the price looks like EGP (over 1000), it's already converted
    // In our tests, gold-api.com returned 4492 which is EGP/gram
    let usdToEgp = Number(process.env.NEXT_PUBLIC_USD_EGP_RATE) || 50.5;

    if (ounceUSD > 1000) {
        // Assume it's EGP per gram if name is Gold or symbol is XAU
        const pricePerGram24K = ounceUSD;
        const goldOunceEGP = pricePerGram24K * TROY_OUNCE_GRAMS / EGYPT_MARKET_MARKUP;

        return {
            karat24: Math.round(pricePerGram24K),
            karat22: Math.round(pricePerGram24K * KARAT_PURITY[22]),
            karat21: Math.round(pricePerGram24K * KARAT_PURITY[21]),
            karat18: Math.round(pricePerGram24K * KARAT_PURITY[18]),
            karat14: Math.round(pricePerGram24K * KARAT_PURITY[14]),
            ounceUSD: Math.round(goldOunceEGP / usdToEgp),
            ounceEGP: Math.round(goldOunceEGP),
            usdToEgp,
            lastUpdated: new Date(),
            change24h: 0,
            changePercent24h: 0,
        };
    }

    // Standard USD/ounce calculation
    const goldOunceEGP = ounceUSD * usdToEgp;
    const pricePerGram24K = (goldOunceEGP / TROY_OUNCE_GRAMS) * EGYPT_MARKET_MARKUP;

    return {
        karat24: Math.round(pricePerGram24K),
        karat22: Math.round(pricePerGram24K * KARAT_PURITY[22]),
        karat21: Math.round(pricePerGram24K * KARAT_PURITY[21]),
        karat18: Math.round(pricePerGram24K * KARAT_PURITY[18]),
        karat14: Math.round(pricePerGram24K * KARAT_PURITY[14]),
        ounceUSD: Math.round(ounceUSD * 100) / 100,
        ounceEGP: Math.round(goldOunceEGP),
        usdToEgp,
        lastUpdated: new Date(),
        change24h: 0,
        changePercent24h: 0,
    };
}

function getDemoPrices(): GoldPrices {
    // Realistic prices as of early 2026 for demo/fallback
    return {
        karat24: 4920,
        karat22: 4510,
        karat21: 4305,
        karat18: 3690,
        karat14: 2870,
        ounceUSD: 3020,
        ounceEGP: 152510,
        usdToEgp: Number(process.env.NEXT_PUBLIC_USD_EGP_RATE) || 50.5,
        lastUpdated: new Date(),
        change24h: 12.5,
        changePercent24h: 0.42,
    };
}

export function getCraftsmanshipEstimates(): CraftsmanshipEstimate[] {
    return Object.entries(CRAFTSMANSHIP_RANGES).map(([karat, range]) => ({
        karat: parseInt(karat),
        minPerGram: range.min,
        maxPerGram: range.max,
    }));
}

export function calculateGoldValue(
    weightGrams: number,
    karat: number,
    pricePerGram24K: number,
    craftsmanshipPerGram: number = 0
): {
    goldValue: number;
    craftsmanshipCost: number;
    totalValue: number;
} {
    const purity = KARAT_PURITY[karat] || karat / 24;
    const goldValue = weightGrams * pricePerGram24K * purity;
    const craftsmanshipCost = weightGrams * craftsmanshipPerGram;

    return {
        goldValue: Math.round(goldValue),
        craftsmanshipCost: Math.round(craftsmanshipCost),
        totalValue: Math.round(goldValue + craftsmanshipCost),
    };
}

export function convertKarat(
    weightGrams: number,
    fromKarat: number,
    toKarat: number
): number {
    const fromPurity = KARAT_PURITY[fromKarat] || fromKarat / 24;
    const toPurity = KARAT_PURITY[toKarat] || toKarat / 24;
    return Math.round((weightGrams * fromPurity / toPurity) * 1000) / 1000;
}

export function formatPrice(price: number): string {
    return price.toLocaleString('ar-EG');
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
