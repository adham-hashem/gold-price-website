export interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    metaDescription: string | null;
    category: string | null;
    publishedAt: string;
    isPublished: boolean;
    showPrices: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchArticles(): Promise<Article[]> {
    try {
        const response = await fetch(`${API_URL}/api/articles`, {
            cache: 'no-store' // Disable cache for debugging
        });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const response = await fetch(`${API_URL}/api/articles/${slug}`, {
            cache: 'no-store'
        });
        if (!response.ok) return null;
        return response.json();
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
