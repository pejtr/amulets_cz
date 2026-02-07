/**
 * Article Headline A/B Testing
 * 
 * Allows testing different headlines for articles to measure:
 * - CTR (click-through rate) from listing pages
 * - Read time (engagement depth)
 * - Scroll depth (how far users read)
 * - Completion rate (users who read >80% of article)
 */

import { getDb } from "./db";
import { articleHeadlineTests, articleHeadlineAssignments } from "../drizzle/schema";
import { eq, and, sql, desc } from "drizzle-orm";

/**
 * Get or assign a headline variant for a visitor
 */
export async function getHeadlineVariant(articleSlug: string, visitorId: string): Promise<{
  variantKey: string;
  headline: string;
  isControl: boolean;
} | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Check if visitor already has an assignment
    const existing = await db.select()
      .from(articleHeadlineAssignments)
      .where(and(
        eq(articleHeadlineAssignments.articleSlug, articleSlug),
        eq(articleHeadlineAssignments.visitorId, visitorId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Return existing assignment
      const variant = await db.select()
        .from(articleHeadlineTests)
        .where(and(
          eq(articleHeadlineTests.articleSlug, articleSlug),
          eq(articleHeadlineTests.variantKey, existing[0].variantKey)
        ))
        .limit(1);

      if (variant.length > 0) {
        return {
          variantKey: variant[0].variantKey,
          headline: variant[0].headline,
          isControl: variant[0].isControl,
        };
      }
    }

    // Get active variants for this article
    const variants = await db.select()
      .from(articleHeadlineTests)
      .where(and(
        eq(articleHeadlineTests.articleSlug, articleSlug),
        eq(articleHeadlineTests.isActive, true)
      ));

    if (variants.length === 0) return null;

    // Weighted random selection based on impression count (favor less-shown variants)
    const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);
    let selectedVariant;

    if (totalImpressions === 0) {
      // Random selection for first visitors
      selectedVariant = variants[Math.floor(Math.random() * variants.length)];
    } else {
      // Inverse-weight selection: show less-seen variants more
      const weights = variants.map(v => {
        const ratio = v.impressions / (totalImpressions || 1);
        return Math.max(0.1, 1 - ratio);
      });
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;
      
      selectedVariant = variants[variants.length - 1];
      for (let i = 0; i < variants.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          selectedVariant = variants[i];
          break;
        }
      }
    }

    // Create assignment
    await db.insert(articleHeadlineAssignments).values({
      articleSlug,
      variantKey: selectedVariant.variantKey,
      visitorId,
    });

    // Increment impressions
    await db.update(articleHeadlineTests)
      .set({ impressions: sql`${articleHeadlineTests.impressions} + 1` })
      .where(eq(articleHeadlineTests.id, selectedVariant.id));

    return {
      variantKey: selectedVariant.variantKey,
      headline: selectedVariant.headline,
      isControl: selectedVariant.isControl,
    };
  } catch (error) {
    console.error('[Headline AB] Error getting variant:', error);
    return null;
  }
}

/**
 * Track a click on a headline variant
 */
export async function trackHeadlineClick(articleSlug: string, visitorId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Update assignment
    await db.update(articleHeadlineAssignments)
      .set({ clicked: true })
      .where(and(
        eq(articleHeadlineAssignments.articleSlug, articleSlug),
        eq(articleHeadlineAssignments.visitorId, visitorId)
      ));

    // Get variant key for this assignment
    const assignment = await db.select()
      .from(articleHeadlineAssignments)
      .where(and(
        eq(articleHeadlineAssignments.articleSlug, articleSlug),
        eq(articleHeadlineAssignments.visitorId, visitorId)
      ))
      .limit(1);

    if (assignment.length > 0) {
      await db.update(articleHeadlineTests)
        .set({ clicks: sql`${articleHeadlineTests.clicks} + 1` })
        .where(and(
          eq(articleHeadlineTests.articleSlug, articleSlug),
          eq(articleHeadlineTests.variantKey, assignment[0].variantKey)
        ));
    }

    return true;
  } catch (error) {
    console.error('[Headline AB] Error tracking click:', error);
    return false;
  }
}

/**
 * Update engagement metrics for a headline assignment
 */
export async function updateHeadlineEngagement(
  articleSlug: string,
  visitorId: string,
  data: {
    readTimeSeconds?: number;
    scrollDepthPercent?: number;
    completed?: boolean;
  }
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Update assignment
    const updateData: Record<string, any> = {};
    if (data.readTimeSeconds !== undefined) updateData.readTimeSeconds = data.readTimeSeconds;
    if (data.scrollDepthPercent !== undefined) updateData.scrollDepthPercent = data.scrollDepthPercent;
    if (data.completed !== undefined) updateData.completed = data.completed;

    await db.update(articleHeadlineAssignments)
      .set(updateData)
      .where(and(
        eq(articleHeadlineAssignments.articleSlug, articleSlug),
        eq(articleHeadlineAssignments.visitorId, visitorId)
      ));

    // Get variant key
    const assignment = await db.select()
      .from(articleHeadlineAssignments)
      .where(and(
        eq(articleHeadlineAssignments.articleSlug, articleSlug),
        eq(articleHeadlineAssignments.visitorId, visitorId)
      ))
      .limit(1);

    if (assignment.length > 0) {
      const variantUpdate: Record<string, any> = {};
      if (data.readTimeSeconds) {
        variantUpdate.totalReadTime = sql`${articleHeadlineTests.totalReadTime} + ${data.readTimeSeconds}`;
      }
      if (data.scrollDepthPercent) {
        variantUpdate.totalScrollDepth = sql`${articleHeadlineTests.totalScrollDepth} + ${data.scrollDepthPercent}`;
      }
      if (data.completed) {
        variantUpdate.completions = sql`${articleHeadlineTests.completions} + 1`;
      }

      if (Object.keys(variantUpdate).length > 0) {
        await db.update(articleHeadlineTests)
          .set(variantUpdate)
          .where(and(
            eq(articleHeadlineTests.articleSlug, articleSlug),
            eq(articleHeadlineTests.variantKey, assignment[0].variantKey)
          ));
      }
    }

    return true;
  } catch (error) {
    console.error('[Headline AB] Error updating engagement:', error);
    return false;
  }
}

/**
 * Create a new headline A/B test
 */
export async function createHeadlineTest(data: {
  articleSlug: string;
  articleType?: string;
  variants: Array<{
    variantKey: string;
    headline: string;
    isControl?: boolean;
  }>;
}): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Delete existing tests for this article (to avoid unique key conflicts)
    await db.delete(articleHeadlineTests)
      .where(eq(articleHeadlineTests.articleSlug, data.articleSlug));

    // Insert new variants
    for (const variant of data.variants) {
      await db.insert(articleHeadlineTests).values({
        articleSlug: data.articleSlug,
        articleType: data.articleType || 'magazine',
        variantKey: variant.variantKey,
        headline: variant.headline,
        isControl: variant.isControl || false,
      });
    }

    return true;
  } catch (error) {
    console.error('[Headline AB] Error creating test:', error);
    return false;
  }
}

/**
 * Get headline test results for an article
 */
export async function getHeadlineTestResults(articleSlug?: string): Promise<Array<{
  articleSlug: string;
  articleType: string;
  variantKey: string;
  headline: string;
  isControl: boolean;
  isActive: boolean;
  impressions: number;
  clicks: number;
  ctr: number;
  avgReadTime: number;
  avgScrollDepth: number;
  completionRate: number;
}>> {
  const db = await getDb();
  if (!db) return [];

  try {
    const conditions = articleSlug
      ? eq(articleHeadlineTests.articleSlug, articleSlug)
      : undefined;

    const results = await db.select()
      .from(articleHeadlineTests)
      .where(conditions)
      .orderBy(desc(articleHeadlineTests.createdAt));

    return results.map(r => ({
      articleSlug: r.articleSlug,
      articleType: r.articleType,
      variantKey: r.variantKey,
      headline: r.headline,
      isControl: r.isControl,
      isActive: r.isActive,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.impressions > 0 ? (r.clicks / r.impressions) * 100 : 0,
      avgReadTime: r.clicks > 0 ? r.totalReadTime / r.clicks : 0,
      avgScrollDepth: r.clicks > 0 ? r.totalScrollDepth / r.clicks : 0,
      completionRate: r.clicks > 0 ? (r.completions / r.clicks) * 100 : 0,
    }));
  } catch (error) {
    console.error('[Headline AB] Error getting results:', error);
    return [];
  }
}

/**
 * Get all articles with active headline tests
 */
export async function getActiveHeadlineTests(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const results = await db.selectDistinct({ articleSlug: articleHeadlineTests.articleSlug })
      .from(articleHeadlineTests)
      .where(eq(articleHeadlineTests.isActive, true));

    return results.map(r => r.articleSlug);
  } catch (error) {
    console.error('[Headline AB] Error getting active tests:', error);
    return [];
  }
}
