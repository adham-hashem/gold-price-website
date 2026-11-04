import { desc } from 'drizzle-orm';
import { getDb } from '@/db';
import { priceHistory } from '@/db/schema';
export async function fetchHistory() {
  const rows = await getDb().select().from(priceHistory).orderBy(desc(priceHistory.timestamp)).limit(30);
  return rows.reverse().filter(r => r.karat21 !== null && r.timestamp !== null).map(r => ({ timestamp: r.timestamp!.toISOString(), karat21: r.karat21! }));
}
