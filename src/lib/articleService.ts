export interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    metaDescription: string | null;
    category: string | null;
    publishedAt: string;
    updatedAt?: string | null;
    isPublished: boolean;
    showPrices: boolean;
    price24?: number | null;
    price21?: number | null;
    price18?: number | null;
    price14?: number | null;
    priceGoldPound?: number | null;
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
