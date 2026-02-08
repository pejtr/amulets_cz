import { getDb } from "./db";
import { readingHistory } from "../drizzle/schema";
import { eq, and, desc, sql, ne, inArray } from "drizzle-orm";

/**
 * Doporučovací systém článků
 * Kombinuje content-based filtering (kategorie, typ) s collaborative filtering (co čtou podobní čtenáři)
 */

// Track reading history
export async function trackReading(params: {
  visitorId: string;
  userId?: number;
  articleSlug: string;
  articleType: string;
  articleCategory?: string;
  readTimeSeconds: number;
  scrollDepthPercent: number;
  completed: boolean;
  referrerSource?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if entry already exists for this visitor+article
  const existing = await db
    .select()
    .from(readingHistory)
    .where(
      and(
        eq(readingHistory.visitorId, params.visitorId),
        eq(readingHistory.articleSlug, params.articleSlug)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing - keep max values
    await db
      .update(readingHistory)
      .set({
        readTimeSeconds: Math.max(existing[0].readTimeSeconds, params.readTimeSeconds),
        scrollDepthPercent: Math.max(existing[0].scrollDepthPercent, params.scrollDepthPercent),
        completed: existing[0].completed || params.completed,
        userId: params.userId || existing[0].userId,
      })
      .where(eq(readingHistory.id, existing[0].id));
    return existing[0].id;
  }

  // Insert new
  const [result] = await db.insert(readingHistory).values({
    visitorId: params.visitorId,
    userId: params.userId || null,
    articleSlug: params.articleSlug,
    articleType: params.articleType,
    articleCategory: params.articleCategory || null,
    readTimeSeconds: params.readTimeSeconds,
    scrollDepthPercent: params.scrollDepthPercent,
    completed: params.completed,
    referrerSource: params.referrerSource || null,
  });

  return result.insertId;
}

// Get reading history for a visitor
export async function getReadingHistory(visitorId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(readingHistory)
    .where(eq(readingHistory.visitorId, visitorId))
    .orderBy(desc(readingHistory.updatedAt))
    .limit(limit);
}

/**
 * Content-based recommendations
 * Doporučuje články ze stejné kategorie/typu, které uživatel ještě nečetl
 */
export async function getContentBasedRecommendations(
  visitorId: string,
  currentArticleSlug: string,
  limit = 6
): Promise<Array<{ articleSlug: string; articleType: string; articleCategory: string | null; score: number; reason: string }>> {
  const db = await getDb();
  if (!db) return [];

  // Get what this visitor has read
  const history = await db
    .select()
    .from(readingHistory)
    .where(eq(readingHistory.visitorId, visitorId))
    .orderBy(desc(readingHistory.readTimeSeconds));

  const readSlugs = new Set(history.map((h: any) => h.articleSlug));
  readSlugs.add(currentArticleSlug);

  // Get categories and types the user prefers (weighted by read time)
  const categoryWeights: Record<string, number> = {};
  const typeWeights: Record<string, number> = {};

  for (const h of history) {
    const weight = h.completed ? 3 : h.scrollDepthPercent > 50 ? 2 : 1;
    if (h.articleCategory) {
      categoryWeights[h.articleCategory] = (categoryWeights[h.articleCategory] || 0) + weight;
    }
    typeWeights[h.articleType] = (typeWeights[h.articleType] || 0) + weight;
  }

  // Get all articles that others have read (as a pool of available articles)
  const allArticles = await db
    .select({
      articleSlug: readingHistory.articleSlug,
      articleType: readingHistory.articleType,
      articleCategory: readingHistory.articleCategory,
      totalReaders: sql<number>`COUNT(DISTINCT ${readingHistory.visitorId})`,
      avgReadTime: sql<number>`AVG(${readingHistory.readTimeSeconds})`,
      completionRate: sql<number>`AVG(${readingHistory.completed}) * 100`,
    })
    .from(readingHistory)
    .where(ne(readingHistory.articleSlug, currentArticleSlug))
    .groupBy(readingHistory.articleSlug, readingHistory.articleType, readingHistory.articleCategory)
    .orderBy(desc(sql`COUNT(DISTINCT ${readingHistory.visitorId})`));

  // Score each article
  const scored = allArticles
    .filter((a: any) => !readSlugs.has(a.articleSlug))
    .map((a: any) => {
      let score = 0;
      let reason = "";

      // Category match bonus
      if (a.articleCategory && categoryWeights[a.articleCategory]) {
        score += categoryWeights[a.articleCategory] * 10;
        reason = `Podobná kategorie: ${a.articleCategory}`;
      }

      // Type match bonus
      if (typeWeights[a.articleType]) {
        score += typeWeights[a.articleType] * 5;
        if (!reason) reason = `Stejný typ obsahu`;
      }

      // Popularity bonus (log scale)
      score += Math.log2(a.totalReaders + 1) * 3;

      // Quality bonus (completion rate)
      score += (a.completionRate / 100) * 5;

      if (!reason) reason = "Populární článek";

      return {
        articleSlug: a.articleSlug,
        articleType: a.articleType,
        articleCategory: a.articleCategory,
        score: Math.round(score * 100) / 100,
        reason,
      };
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

/**
 * Collaborative filtering recommendations
 * "Čtenáři, kteří četli tento článek, četli také..."
 */
export async function getCollaborativeRecommendations(
  currentArticleSlug: string,
  visitorId: string,
  limit = 6
): Promise<Array<{ articleSlug: string; articleType: string; coReaders: number; score: number; reason: string }>> {
  const db = await getDb();
  if (!db) return [];

  // Find visitors who read the current article
  const coReaders = await db
    .select({ visitorId: readingHistory.visitorId })
    .from(readingHistory)
    .where(
      and(
        eq(readingHistory.articleSlug, currentArticleSlug),
        ne(readingHistory.visitorId, visitorId)
      )
    );

  if (coReaders.length === 0) {
    return [];
  }

  const coReaderIds = coReaders.map((r: { visitorId: string }) => r.visitorId);

  // Get what this visitor has already read
  const myHistory = await db
    .select({ articleSlug: readingHistory.articleSlug })
    .from(readingHistory)
    .where(eq(readingHistory.visitorId, visitorId));

  const readSlugs = new Set(myHistory.map((h: { articleSlug: string }) => h.articleSlug));
  readSlugs.add(currentArticleSlug);

  // Find what co-readers also read
  const coReadArticles = await db
    .select({
      articleSlug: readingHistory.articleSlug,
      articleType: readingHistory.articleType,
      readerCount: sql<number>`COUNT(DISTINCT ${readingHistory.visitorId})`,
      avgCompletion: sql<number>`AVG(${readingHistory.completed}) * 100`,
    })
    .from(readingHistory)
    .where(
      and(
        inArray(readingHistory.visitorId, coReaderIds),
        ne(readingHistory.articleSlug, currentArticleSlug)
      )
    )
    .groupBy(readingHistory.articleSlug, readingHistory.articleType)
    .orderBy(desc(sql`COUNT(DISTINCT ${readingHistory.visitorId})`));

  return coReadArticles
    .filter((a: any) => !readSlugs.has(a.articleSlug))
    .map((a: any) => ({
      articleSlug: a.articleSlug,
      articleType: a.articleType,
      coReaders: a.readerCount,
      score: a.readerCount * 10 + (a.avgCompletion / 100) * 5,
      reason: `${a.readerCount} čtenářů tohoto článku četlo také`,
    }))
    .slice(0, limit);
}

/**
 * Hybrid recommendations - combines content-based and collaborative
 */
export async function getRecommendations(
  visitorId: string,
  currentArticleSlug: string,
  limit = 6
): Promise<Array<{
  articleSlug: string;
  articleType: string;
  score: number;
  reason: string;
  source: "content" | "collaborative" | "popular";
}>> {
  const db = await getDb();

  const [contentRecs, collabRecs] = await Promise.all([
    getContentBasedRecommendations(visitorId, currentArticleSlug, limit),
    getCollaborativeRecommendations(currentArticleSlug, visitorId, limit),
  ]);

  // Merge and deduplicate
  const merged = new Map<string, {
    articleSlug: string;
    articleType: string;
    score: number;
    reason: string;
    source: "content" | "collaborative" | "popular";
  }>();

  for (const rec of collabRecs) {
    merged.set(rec.articleSlug, {
      articleSlug: rec.articleSlug,
      articleType: rec.articleType,
      score: rec.score * 1.2, // Collaborative gets slight boost
      reason: rec.reason,
      source: "collaborative",
    });
  }

  for (const rec of contentRecs) {
    if (merged.has(rec.articleSlug)) {
      // Boost score if both methods recommend it
      const existing = merged.get(rec.articleSlug)!;
      existing.score += rec.score;
      existing.reason = `${existing.reason} • ${rec.reason}`;
    } else {
      merged.set(rec.articleSlug, {
        articleSlug: rec.articleSlug,
        articleType: rec.articleType,
        score: rec.score,
        reason: rec.reason,
        source: "content",
      });
    }
  }

  // If not enough recommendations, add popular articles
  if (merged.size < limit && db) {
    const popular = await db
      .select({
        articleSlug: readingHistory.articleSlug,
        articleType: readingHistory.articleType,
        readers: sql<number>`COUNT(DISTINCT ${readingHistory.visitorId})`,
      })
      .from(readingHistory)
      .where(ne(readingHistory.articleSlug, currentArticleSlug))
      .groupBy(readingHistory.articleSlug, readingHistory.articleType)
      .orderBy(desc(sql`COUNT(DISTINCT ${readingHistory.visitorId})`))
      .limit(limit);

    for (const p of popular) {
      if (!merged.has(p.articleSlug)) {
        merged.set(p.articleSlug, {
          articleSlug: p.articleSlug,
          articleType: p.articleType,
          score: Math.log2(p.readers + 1) * 5,
          reason: `Populární článek (${p.readers} čtenářů)`,
          source: "popular",
        });
      }
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get reading stats for admin dashboard
 */
export async function getReadingStats() {
  const db = await getDb();
  if (!db) return { totalReaders: 0, totalReads: 0, avgReadTimeSeconds: 0, completionRate: 0, topArticles: [] };

  const [totalReaders] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${readingHistory.visitorId})` })
    .from(readingHistory);

  const [totalReads] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(readingHistory);

  const [avgReadTime] = await db
    .select({ avg: sql<number>`AVG(${readingHistory.readTimeSeconds})` })
    .from(readingHistory);

  const [completionRate] = await db
    .select({ rate: sql<number>`AVG(${readingHistory.completed}) * 100` })
    .from(readingHistory);

  const topArticles = await db
    .select({
      articleSlug: readingHistory.articleSlug,
      articleType: readingHistory.articleType,
      readers: sql<number>`COUNT(DISTINCT ${readingHistory.visitorId})`,
      avgTime: sql<number>`AVG(${readingHistory.readTimeSeconds})`,
      completionRate: sql<number>`AVG(${readingHistory.completed}) * 100`,
    })
    .from(readingHistory)
    .groupBy(readingHistory.articleSlug, readingHistory.articleType)
    .orderBy(desc(sql`COUNT(DISTINCT ${readingHistory.visitorId})`))
    .limit(10);

  return {
    totalReaders: totalReaders?.count || 0,
    totalReads: totalReads?.count || 0,
    avgReadTimeSeconds: Math.round(avgReadTime?.avg || 0),
    completionRate: Math.round((completionRate?.rate || 0) * 10) / 10,
    topArticles,
  };
}
