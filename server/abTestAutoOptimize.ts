import { getDb } from "./db";
import { chatbotVariants, chatbotSessions } from "../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";

/**
 * Auto-optimalizace A/B testingu
 * 
 * Po dosažení 100+ konverzací na variantu:
 * 1. Analyzuje konverzní poměry všech variant
 * 2. Najde nejlepší variantu
 * 3. Zvýší její váhu (traffic) na 50%
 * 4. Sníží váhu ostatních variant proporcionálně
 * 
 * Toto umožňuje Multi-Armed Bandit přístup:
 * - Exploit: Více traffic na nejlepší variantu
 * - Explore: Stále testujeme ostatní varianty (50% traffic)
 */

interface VariantStats {
  variantId: number;
  variantKey: string;
  name: string;
  totalSessions: number;
  totalConversions: number;
  conversionRate: number;
  currentWeight: number;
}

interface OptimizationResult {
  optimized: boolean;
  reason: string;
  totalConversions: number;
  bestVariant: VariantStats | null;
  weightChanges: Array<{
    variantId: number;
    name: string;
    oldWeight: number;
    newWeight: number;
  }>;
}

const MIN_CONVERSIONS_FOR_OPTIMIZATION = 100;
const WINNER_WEIGHT_PERCENTAGE = 50; // Vítěz dostane 50% traffic

export async function autoOptimizeVariantWeights(): Promise<OptimizationResult> {
  const db = await getDb();
  if (!db) {
    return {
      optimized: false,
      reason: "Database not available",
      totalConversions: 0,
      bestVariant: null,
      weightChanges: [],
    };
  }

  // Get all active variants
  const activeVariants = await db
    .select()
    .from(chatbotVariants)
    .where(eq(chatbotVariants.isActive, true));

  if (activeVariants.length <= 1) {
    return {
      optimized: false,
      reason: "Need at least 2 active variants to optimize",
      totalConversions: 0,
      bestVariant: null,
      weightChanges: [],
    };
  }

  // Calculate stats for each variant (all time)
  const variantStats: VariantStats[] = await Promise.all(
    activeVariants.map(async (variant: any) => {
      const sessions = await db
        .select({
          totalSessions: sql<number>`COUNT(DISTINCT ${chatbotSessions.id})`,
          totalConversions: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END)`,
        })
        .from(chatbotSessions)
        .where(eq(chatbotSessions.variantId, variant.id));

      const totalSessions = Number(sessions[0]?.totalSessions || 0);
      const totalConversions = Number(sessions[0]?.totalConversions || 0);
      const conversionRate = totalSessions > 0 
        ? (totalConversions / totalSessions) * 100 
        : 0;

      return {
        variantId: variant.id,
        variantKey: variant.variantKey,
        name: variant.name,
        totalSessions,
        totalConversions,
        conversionRate,
        currentWeight: variant.weight,
      };
    })
  );

  // Calculate total conversions across all variants
  const totalConversions = variantStats.reduce((sum, v) => sum + v.totalConversions, 0);

  // Check if we have enough data
  if (totalConversions < MIN_CONVERSIONS_FOR_OPTIMIZATION) {
    return {
      optimized: false,
      reason: `Need ${MIN_CONVERSIONS_FOR_OPTIMIZATION} conversions, currently have ${totalConversions}`,
      totalConversions,
      bestVariant: null,
      weightChanges: [],
    };
  }

  // Find best variant by conversion rate
  const bestVariant = variantStats.reduce((best, current) => 
    current.conversionRate > best.conversionRate ? current : best
  );

  // Calculate new weights
  // Winner gets WINNER_WEIGHT_PERCENTAGE, rest is distributed among others
  const otherVariants = variantStats.filter(v => v.variantId !== bestVariant.variantId);
  const remainingWeight = 100 - WINNER_WEIGHT_PERCENTAGE;
  const weightPerOther = Math.floor(remainingWeight / otherVariants.length);

  const weightChanges: OptimizationResult["weightChanges"] = [];

  // Update winner weight
  if (bestVariant.currentWeight !== WINNER_WEIGHT_PERCENTAGE) {
    await db
      .update(chatbotVariants)
      .set({ weight: WINNER_WEIGHT_PERCENTAGE })
      .where(eq(chatbotVariants.id, bestVariant.variantId));

    weightChanges.push({
      variantId: bestVariant.variantId,
      name: bestVariant.name,
      oldWeight: bestVariant.currentWeight,
      newWeight: WINNER_WEIGHT_PERCENTAGE,
    });
  }

  // Update other variants weights
  for (const variant of otherVariants) {
    if (variant.currentWeight !== weightPerOther) {
      await db
        .update(chatbotVariants)
        .set({ weight: weightPerOther })
        .where(eq(chatbotVariants.id, variant.variantId));

      weightChanges.push({
        variantId: variant.variantId,
        name: variant.name,
        oldWeight: variant.currentWeight,
        newWeight: weightPerOther,
      });
    }
  }

  return {
    optimized: weightChanges.length > 0,
    reason: weightChanges.length > 0 
      ? `Optimized weights: ${bestVariant.name} (${bestVariant.conversionRate.toFixed(2)}% CR) now gets ${WINNER_WEIGHT_PERCENTAGE}% traffic`
      : "Weights already optimized",
    totalConversions,
    bestVariant,
    weightChanges,
  };
}

/**
 * Get current optimization status
 */
export async function getOptimizationStatus(): Promise<{
  totalConversions: number;
  conversionsNeeded: number;
  isOptimized: boolean;
  variants: VariantStats[];
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalConversions: 0,
      conversionsNeeded: MIN_CONVERSIONS_FOR_OPTIMIZATION,
      isOptimized: false,
      variants: [],
    };
  }

  const activeVariants = await db
    .select()
    .from(chatbotVariants)
    .where(eq(chatbotVariants.isActive, true));

  const variantStats: VariantStats[] = await Promise.all(
    activeVariants.map(async (variant: any) => {
      const sessions = await db
        .select({
          totalSessions: sql<number>`COUNT(DISTINCT ${chatbotSessions.id})`,
          totalConversions: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END)`,
        })
        .from(chatbotSessions)
        .where(eq(chatbotSessions.variantId, variant.id));

      const totalSessions = Number(sessions[0]?.totalSessions || 0);
      const totalConversions = Number(sessions[0]?.totalConversions || 0);
      const conversionRate = totalSessions > 0 
        ? (totalConversions / totalSessions) * 100 
        : 0;

      return {
        variantId: variant.id,
        variantKey: variant.variantKey,
        name: variant.name,
        totalSessions,
        totalConversions,
        conversionRate,
        currentWeight: variant.weight,
      };
    })
  );

  const totalConversions = variantStats.reduce((sum, v) => sum + v.totalConversions, 0);
  
  // Check if already optimized (one variant has significantly higher weight)
  const maxWeight = Math.max(...variantStats.map(v => v.currentWeight));
  const isOptimized = maxWeight >= WINNER_WEIGHT_PERCENTAGE;

  return {
    totalConversions,
    conversionsNeeded: Math.max(0, MIN_CONVERSIONS_FOR_OPTIMIZATION - totalConversions),
    isOptimized,
    variants: variantStats,
  };
}
