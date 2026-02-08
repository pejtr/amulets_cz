import { getDb } from "./db";
import { widgetAbTests, widgetAbVariants, widgetAbAssigns } from "../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

/**
 * Widget Placement A/B Testing System
 * Tests different widget positions (e.g., recommendations before vs after comments)
 * to find optimal placement for maximum CTR
 */

// Create a new widget placement test
export async function createWidgetTest(params: {
  widgetName: string;
  variants: Array<{ variantName: string; placement: string }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [test] = await db.insert(widgetAbTests).values({
    widgetName: params.widgetName,
    isActive: true,
  });

  const testId = test.insertId;

  for (const v of params.variants) {
    await db.insert(widgetAbVariants).values({
      testId: Number(testId),
      variantName: v.variantName,
      placement: v.placement,
      impressions: 0,
      clicks: 0,
      isWinner: false,
    });
  }

  return { testId: Number(testId), variantCount: params.variants.length };
}

// Get active test for a widget
export async function getActiveWidgetTest(widgetName: string) {
  const db = await getDb();
  if (!db) return null;

  const tests = await db
    .select()
    .from(widgetAbTests)
    .where(and(eq(widgetAbTests.widgetName, widgetName), eq(widgetAbTests.isActive, true)))
    .orderBy(desc(widgetAbTests.createdAt))
    .limit(1);

  if (tests.length === 0) return null;

  const test = tests[0];
  const variants = await db
    .select()
    .from(widgetAbVariants)
    .where(eq(widgetAbVariants.testId, test.id));

  return { ...test, variants };
}

// Assign a visitor to a variant (deterministic based on visitorId hash)
export async function getOrAssignVariant(params: {
  widgetName: string;
  visitorId: string;
  articleSlug?: string;
}): Promise<{ variantId: number; variantName: string; placement: string } | null> {
  const db = await getDb();
  if (!db) return null;

  const test = await getActiveWidgetTest(params.widgetName);
  if (!test || test.variants.length === 0) return null;

  // Check existing assignment
  const existing = await db
    .select()
    .from(widgetAbAssigns)
    .where(
      and(
        eq(widgetAbAssigns.testId, test.id),
        eq(widgetAbAssigns.visitorId, params.visitorId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const variant = test.variants.find((v: any) => v.id === existing[0].variantId);
    if (variant) {
      return {
        variantId: variant.id,
        variantName: variant.variantName,
        placement: variant.placement,
      };
    }
  }

  // Assign based on hash of visitorId for deterministic assignment
  let hash = 0;
  for (let i = 0; i < params.visitorId.length; i++) {
    hash = ((hash << 5) - hash + params.visitorId.charCodeAt(i)) | 0;
  }
  const variantIndex = Math.abs(hash) % test.variants.length;
  const assigned = test.variants[variantIndex];

  // Record assignment
  await db.insert(widgetAbAssigns).values({
    testId: test.id,
    variantId: assigned.id,
    visitorId: params.visitorId,
    clicked: false,
    articleSlug: params.articleSlug || null,
  });

  // Increment impressions
  await db
    .update(widgetAbVariants)
    .set({ impressions: sql`${widgetAbVariants.impressions} + 1` })
    .where(eq(widgetAbVariants.id, assigned.id));

  return {
    variantId: assigned.id,
    variantName: assigned.variantName,
    placement: assigned.placement,
  };
}

// Track a click on a widget variant
export async function trackWidgetClick(params: {
  variantId: number;
  visitorId: string;
}) {
  const db = await getDb();
  if (!db) return false;

  // Update assignment
  await db
    .update(widgetAbAssigns)
    .set({ clicked: true })
    .where(
      and(
        eq(widgetAbAssigns.variantId, params.variantId),
        eq(widgetAbAssigns.visitorId, params.visitorId)
      )
    );

  // Increment clicks
  await db
    .update(widgetAbVariants)
    .set({ clicks: sql`${widgetAbVariants.clicks} + 1` })
    .where(eq(widgetAbVariants.id, params.variantId));

  return true;
}

// Get test results with CTR calculation and Z-test
export async function getWidgetTestResults(testId: number) {
  const db = await getDb();
  if (!db) return null;

  const tests = await db
    .select()
    .from(widgetAbTests)
    .where(eq(widgetAbTests.id, testId))
    .limit(1);

  if (tests.length === 0) return null;

  const test = tests[0];
  const variants = await db
    .select()
    .from(widgetAbVariants)
    .where(eq(widgetAbVariants.testId, testId));

  // Calculate CTR and statistical significance
  const results = variants.map((v: any) => {
    const ctr = v.impressions > 0 ? (v.clicks / v.impressions) * 100 : 0;
    return {
      ...v,
      ctr: Math.round(ctr * 100) / 100,
    };
  });

  // Z-test between variants (if 2 variants)
  let significance = null;
  if (results.length === 2) {
    const [a, b] = results;
    if (a.impressions > 0 && b.impressions > 0) {
      const p1 = a.clicks / a.impressions;
      const p2 = b.clicks / b.impressions;
      const pPooled = (a.clicks + b.clicks) / (a.impressions + b.impressions);
      const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / a.impressions + 1 / b.impressions));
      const zScore = se > 0 ? (p1 - p2) / se : 0;
      const confidence = Math.min(99.9, Math.abs(zScore) * 30); // Approximate
      significance = {
        zScore: Math.round(zScore * 100) / 100,
        confidence: Math.round(confidence * 10) / 10,
        isSignificant: Math.abs(zScore) >= 1.96,
        winner: zScore > 0 ? a.variantName : b.variantName,
      };
    }
  }

  return {
    test,
    variants: results,
    significance,
    totalImpressions: results.reduce((s: number, v: any) => s + v.impressions, 0),
    totalClicks: results.reduce((s: number, v: any) => s + v.clicks, 0),
  };
}

// Deploy winner - deactivate test and notify
export async function deployWidgetWinner(testId: number, winnerVariantId: number) {
  const db = await getDb();
  if (!db) return false;

  // Mark winner
  await db
    .update(widgetAbVariants)
    .set({ isWinner: true })
    .where(eq(widgetAbVariants.id, winnerVariantId));

  // Deactivate test
  await db
    .update(widgetAbTests)
    .set({ isActive: false })
    .where(eq(widgetAbTests.id, testId));

  // Get winner details for notification
  const variants = await db
    .select()
    .from(widgetAbVariants)
    .where(eq(widgetAbVariants.id, winnerVariantId))
    .limit(1);

  if (variants.length > 0) {
    const winner = variants[0];
    await notifyOwner({
      title: "Widget A/B Test - Vítěz nasazen",
      content: `Widget test #${testId} ukončen. Vítěz: "${winner.variantName}" (${winner.placement}) s CTR ${winner.impressions > 0 ? ((winner.clicks / winner.impressions) * 100).toFixed(1) : 0}%`,
    });
  }

  return true;
}

// Get all tests (for admin)
export async function getAllWidgetTests() {
  const db = await getDb();
  if (!db) return [];

  const tests = await db
    .select()
    .from(widgetAbTests)
    .orderBy(desc(widgetAbTests.createdAt));

  const results = [];
  for (const test of tests) {
    const variants = await db
      .select()
      .from(widgetAbVariants)
      .where(eq(widgetAbVariants.testId, test.id));

    results.push({
      ...test,
      variants: variants.map((v: any) => ({
        ...v,
        ctr: v.impressions > 0 ? Math.round((v.clicks / v.impressions) * 10000) / 100 : 0,
      })),
    });
  }

  return results;
}
