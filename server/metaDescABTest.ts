/**
 * Article Meta Description A/B Testing
 * 
 * Extends the headline A/B testing system to also test meta descriptions
 * for SEO optimization. Measures organic CTR from search engines.
 */

import { getDb } from "./db";
import { articleMetaDescTests, articleMetaDescAssignments } from "../drizzle/schema";
import { eq, and, sql, desc } from "drizzle-orm";

/**
 * Get or assign a meta description variant for a visitor
 */
export async function getMetaDescVariant(articleSlug: string, visitorId: string): Promise<{
  variantKey: string;
  metaDescription: string;
  isControl: boolean;
} | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Check existing assignment
    const existing = await db.select()
      .from(articleMetaDescAssignments)
      .where(and(
        eq(articleMetaDescAssignments.articleSlug, articleSlug),
        eq(articleMetaDescAssignments.visitorId, visitorId)
      ))
      .limit(1);

    if (existing.length > 0) {
      const variant = await db.select()
        .from(articleMetaDescTests)
        .where(and(
          eq(articleMetaDescTests.articleSlug, articleSlug),
          eq(articleMetaDescTests.variantKey, existing[0].variantKey)
        ))
        .limit(1);

      if (variant.length > 0) {
        return {
          variantKey: variant[0].variantKey,
          metaDescription: variant[0].metaDescription,
          isControl: variant[0].isControl,
        };
      }
    }

    // Get active variants
    const variants = await db.select()
      .from(articleMetaDescTests)
      .where(and(
        eq(articleMetaDescTests.articleSlug, articleSlug),
        eq(articleMetaDescTests.isActive, true)
      ));

    if (variants.length === 0) return null;

    // Weighted random selection (favor less-shown variants)
    const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);
    let selectedVariant;

    if (totalImpressions === 0) {
      selectedVariant = variants[Math.floor(Math.random() * variants.length)];
    } else {
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

    // Detect referrer source
    const referrerSource = "direct"; // Will be set by frontend

    // Create assignment
    await db.insert(articleMetaDescAssignments).values({
      articleSlug,
      variantKey: selectedVariant.variantKey,
      visitorId,
      referrerSource,
    });

    // Increment impressions
    await db.update(articleMetaDescTests)
      .set({ impressions: sql`${articleMetaDescTests.impressions} + 1` })
      .where(eq(articleMetaDescTests.id, selectedVariant.id));

    return {
      variantKey: selectedVariant.variantKey,
      metaDescription: selectedVariant.metaDescription,
      isControl: selectedVariant.isControl,
    };
  } catch (error) {
    console.error('[MetaDesc AB] Error getting variant:', error);
    return null;
  }
}

/**
 * Track a click/visit from search results (organic traffic)
 */
export async function trackMetaDescClick(articleSlug: string, visitorId: string, referrerSource?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const updateData: Record<string, any> = { clicked: true };
    if (referrerSource) updateData.referrerSource = referrerSource;

    await db.update(articleMetaDescAssignments)
      .set(updateData)
      .where(and(
        eq(articleMetaDescAssignments.articleSlug, articleSlug),
        eq(articleMetaDescAssignments.visitorId, visitorId)
      ));

    const assignment = await db.select()
      .from(articleMetaDescAssignments)
      .where(and(
        eq(articleMetaDescAssignments.articleSlug, articleSlug),
        eq(articleMetaDescAssignments.visitorId, visitorId)
      ))
      .limit(1);

    if (assignment.length > 0) {
      await db.update(articleMetaDescTests)
        .set({ clicks: sql`${articleMetaDescTests.clicks} + 1` })
        .where(and(
          eq(articleMetaDescTests.articleSlug, articleSlug),
          eq(articleMetaDescTests.variantKey, assignment[0].variantKey)
        ));
    }

    return true;
  } catch (error) {
    console.error('[MetaDesc AB] Error tracking click:', error);
    return false;
  }
}

/**
 * Update engagement metrics for a meta description assignment
 */
export async function updateMetaDescEngagement(
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
    const updateData: Record<string, any> = {};
    if (data.readTimeSeconds !== undefined) updateData.readTimeSeconds = data.readTimeSeconds;
    if (data.scrollDepthPercent !== undefined) updateData.scrollDepthPercent = data.scrollDepthPercent;
    if (data.completed !== undefined) updateData.completed = data.completed;

    await db.update(articleMetaDescAssignments)
      .set(updateData)
      .where(and(
        eq(articleMetaDescAssignments.articleSlug, articleSlug),
        eq(articleMetaDescAssignments.visitorId, visitorId)
      ));

    const assignment = await db.select()
      .from(articleMetaDescAssignments)
      .where(and(
        eq(articleMetaDescAssignments.articleSlug, articleSlug),
        eq(articleMetaDescAssignments.visitorId, visitorId)
      ))
      .limit(1);

    if (assignment.length > 0) {
      const variantUpdate: Record<string, any> = {};
      if (data.readTimeSeconds) {
        variantUpdate.totalReadTime = sql`${articleMetaDescTests.totalReadTime} + ${data.readTimeSeconds}`;
      }
      if (data.scrollDepthPercent) {
        variantUpdate.totalScrollDepth = sql`${articleMetaDescTests.totalScrollDepth} + ${data.scrollDepthPercent}`;
      }
      if (data.completed) {
        variantUpdate.completions = sql`${articleMetaDescTests.completions} + 1`;
      }

      if (Object.keys(variantUpdate).length > 0) {
        await db.update(articleMetaDescTests)
          .set(variantUpdate)
          .where(and(
            eq(articleMetaDescTests.articleSlug, articleSlug),
            eq(articleMetaDescTests.variantKey, assignment[0].variantKey)
          ));
      }
    }

    return true;
  } catch (error) {
    console.error('[MetaDesc AB] Error updating engagement:', error);
    return false;
  }
}

/**
 * Create a new meta description A/B test
 */
export async function createMetaDescTest(data: {
  articleSlug: string;
  articleType?: string;
  variants: Array<{
    variantKey: string;
    metaDescription: string;
    isControl?: boolean;
  }>;
}): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Delete existing tests for this article
    await db.delete(articleMetaDescTests)
      .where(eq(articleMetaDescTests.articleSlug, data.articleSlug));

    for (const variant of data.variants) {
      await db.insert(articleMetaDescTests).values({
        articleSlug: data.articleSlug,
        articleType: data.articleType || 'magazine',
        variantKey: variant.variantKey,
        metaDescription: variant.metaDescription,
        isControl: variant.isControl || false,
      });
    }

    return true;
  } catch (error) {
    console.error('[MetaDesc AB] Error creating test:', error);
    return false;
  }
}

/**
 * Get meta description test results
 */
export async function getMetaDescTestResults(articleSlug?: string): Promise<Array<{
  articleSlug: string;
  articleType: string;
  variantKey: string;
  metaDescription: string;
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
      ? eq(articleMetaDescTests.articleSlug, articleSlug)
      : undefined;

    const results = await db.select()
      .from(articleMetaDescTests)
      .where(conditions)
      .orderBy(desc(articleMetaDescTests.createdAt));

    return results.map(r => ({
      articleSlug: r.articleSlug,
      articleType: r.articleType,
      variantKey: r.variantKey,
      metaDescription: r.metaDescription,
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
    console.error('[MetaDesc AB] Error getting results:', error);
    return [];
  }
}

/**
 * Get all articles with active meta description tests
 */
export async function getActiveMetaDescTests(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const results = await db.selectDistinct({ articleSlug: articleMetaDescTests.articleSlug })
      .from(articleMetaDescTests)
      .where(eq(articleMetaDescTests.isActive, true));

    return results.map(r => r.articleSlug);
  } catch (error) {
    console.error('[MetaDesc AB] Error getting active tests:', error);
    return [];
  }
}

/**
 * Z-test for statistical significance
 */
function calculateSignificance(
  impressionsA: number,
  conversionsA: number,
  impressionsB: number,
  conversionsB: number
): number {
  if (impressionsA < 10 || impressionsB < 10) return 0;

  const pA = conversionsA / impressionsA;
  const pB = conversionsB / impressionsB;
  const pPool = (conversionsA + conversionsB) / (impressionsA + impressionsB);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / impressionsA + 1 / impressionsB));

  if (se === 0) return 0;

  const z = (pB - pA) / se;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327;
  const p = d * Math.exp(-z * z / 2) * (0.3193815 * t + -0.3565638 * t * t + 1.781478 * t * t * t + -1.8212560 * t * t * t * t + 1.3302744 * t * t * t * t * t);

  return z > 0 ? 1 - p : p;
}

/**
 * Evaluate meta description tests and determine winners
 */
export async function evaluateMetaDescTests(minImpressions: number = 100, confidenceThreshold: number = 0.95): Promise<Array<{
  articleSlug: string;
  winner: {
    variantKey: string;
    metaDescription: string;
    ctr: number;
    completionRate: number;
    confidence: number;
  };
  loser: {
    variantKey: string;
    metaDescription: string;
    ctr: number;
    completionRate: number;
  };
  recommendation: string;
}>> {
  const db = await getDb();
  if (!db) return [];

  try {
    const allTests = await db.select()
      .from(articleMetaDescTests)
      .where(eq(articleMetaDescTests.isActive, true));

    const byArticle: Record<string, typeof allTests> = {};
    for (const test of allTests) {
      if (!byArticle[test.articleSlug]) byArticle[test.articleSlug] = [];
      byArticle[test.articleSlug].push(test);
    }

    const results: Array<{
      articleSlug: string;
      winner: { variantKey: string; metaDescription: string; ctr: number; completionRate: number; confidence: number };
      loser: { variantKey: string; metaDescription: string; ctr: number; completionRate: number };
      recommendation: string;
    }> = [];

    for (const [slug, variants] of Object.entries(byArticle)) {
      if (variants.length < 2) continue;

      const allHaveMinImpressions = variants.every(v => v.impressions >= minImpressions);
      if (!allHaveMinImpressions) continue;

      const sorted = [...variants].sort((a, b) => {
        const ctrA = a.impressions > 0 ? a.clicks / a.impressions : 0;
        const ctrB = b.impressions > 0 ? b.clicks / b.impressions : 0;
        return ctrB - ctrA;
      });

      const best = sorted[0];
      const worst = sorted[sorted.length - 1];

      const bestCtr = best.impressions > 0 ? (best.clicks / best.impressions) * 100 : 0;
      const worstCtr = worst.impressions > 0 ? (worst.clicks / worst.impressions) * 100 : 0;
      const bestCompletionRate = best.clicks > 0 ? (best.completions / best.clicks) * 100 : 0;
      const worstCompletionRate = worst.clicks > 0 ? (worst.completions / worst.clicks) * 100 : 0;

      const confidence = calculateSignificance(
        worst.impressions, worst.clicks,
        best.impressions, best.clicks
      );

      if (confidence >= confidenceThreshold) {
        const ctrImprovement = worstCtr > 0 ? ((bestCtr - worstCtr) / worstCtr * 100).toFixed(1) : "∞";

        results.push({
          articleSlug: slug,
          winner: {
            variantKey: best.variantKey,
            metaDescription: best.metaDescription,
            ctr: bestCtr,
            completionRate: bestCompletionRate,
            confidence: Math.round(confidence * 100),
          },
          loser: {
            variantKey: worst.variantKey,
            metaDescription: worst.metaDescription,
            ctr: worstCtr,
            completionRate: worstCompletionRate,
          },
          recommendation: `Meta popis "${best.variantKey}" vyhrává s ${bestCtr.toFixed(1)}% CTR vs ${worstCtr.toFixed(1)}% (jistota ${Math.round(confidence * 100)}%). Zlepšení: +${ctrImprovement}%.`,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('[MetaDesc AB] Error evaluating tests:', error);
    return [];
  }
}

/**
 * Deploy winning meta description variant
 */
export async function deployMetaDescWinner(articleSlug: string, winnerVariantKey: string): Promise<{
  success: boolean;
  message: string;
}> {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };

  try {
    const winner = await db.select()
      .from(articleMetaDescTests)
      .where(and(
        eq(articleMetaDescTests.articleSlug, articleSlug),
        eq(articleMetaDescTests.variantKey, winnerVariantKey),
        eq(articleMetaDescTests.isActive, true)
      ))
      .limit(1);

    if (winner.length === 0) {
      return { success: false, message: `Varianta "${winnerVariantKey}" nebyla nalezena` };
    }

    await db.update(articleMetaDescTests)
      .set({ isActive: false })
      .where(and(
        eq(articleMetaDescTests.articleSlug, articleSlug),
        sql`${articleMetaDescTests.variantKey} != ${winnerVariantKey}`
      ));

    return {
      success: true,
      message: `Vítězný meta popis "${winnerVariantKey}" nasazen pro "${articleSlug}".`,
    };
  } catch (error) {
    console.error('[MetaDesc AB] Error deploying winner:', error);
    return { success: false, message: "Chyba při nasazování" };
  }
}

/**
 * Auto-evaluate and deploy winners
 */
export async function autoEvaluateAndDeployMetaDesc(minImpressions: number = 100, confidenceThreshold: number = 0.95): Promise<{
  evaluated: number;
  deployed: number;
  results: Array<{ articleSlug: string; winner: string; confidence: number; deployed: boolean }>;
}> {
  const winners = await evaluateMetaDescTests(minImpressions, confidenceThreshold);
  const results: Array<{ articleSlug: string; winner: string; confidence: number; deployed: boolean }> = [];

  for (const w of winners) {
    const deployment = await deployMetaDescWinner(w.articleSlug, w.winner.variantKey);
    results.push({
      articleSlug: w.articleSlug,
      winner: w.winner.variantKey,
      confidence: w.winner.confidence,
      deployed: deployment.success,
    });
  }

  return {
    evaluated: winners.length,
    deployed: results.filter(r => r.deployed).length,
    results,
  };
}
