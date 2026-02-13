import { getDb } from "./db";
import { chatbotVariants, chatbotSessions } from "../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";

/**
 * Automaticky deaktivuje varianty s výrazně nižším konverzním poměrem
 * po 7 dnech testování
 * 
 * Logika:
 * 1. Najde všechny aktivní varianty
 * 2. Pro každou variantu spočítá konverzní poměr za posledních 7 dní
 * 3. Najde nejlepší variantu (highest conversion rate)
 * 4. Deaktivuje varianty které mají konverzní poměr nižší než 70% nejlepší varianty
 *    a zároveň mají alespoň 50 konverzací (statistická významnost)
 */
export async function autoDeactivateWeakVariants(): Promise<{
  deactivated: Array<{ variantId: number; name: string; conversionRate: number }>;
  kept: Array<{ variantId: number; name: string; conversionRate: number }>;
}> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const db = await getDb();
  if (!db) {
    return { deactivated: [], kept: [] };
  }

  // Get all active variants
  const activeVariants = await db
    .select()
    .from(chatbotVariants)
    .where(eq(chatbotVariants.isActive, true));

  if (activeVariants.length <= 1) {
    // Need at least 2 variants to compare
    return { deactivated: [], kept: activeVariants.map((v: any) => ({ 
      variantId: v.id, 
      name: v.name, 
      conversionRate: 0 
    })) };
  }

  // Calculate stats for each variant
  const variantStats = await Promise.all(
    activeVariants.map(async (variant: any) => {
      const sessions = await db
        .select({
          totalSessions: sql<number>`COUNT(DISTINCT ${chatbotSessions.id})`,
          totalConversions: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END)`,
        })
        .from(chatbotSessions)
        .where(
          and(
            eq(chatbotSessions.variantId, variant.id),
            gte(chatbotSessions.createdAt, sevenDaysAgo)
          )
        );

      const totalSessions = Number(sessions[0]?.totalSessions || 0);
      const totalConversions = Number(sessions[0]?.totalConversions || 0);
      const conversionRate = totalSessions > 0 
        ? (totalConversions / totalSessions) * 100 
        : 0;

      return {
        variantId: variant.id,
        name: variant.name,
        totalSessions,
        totalConversions,
        conversionRate,
      };
    })
  );

  // Find best variant
  const bestVariant = variantStats.reduce((best: any, current: any) => 
    current.conversionRate > best.conversionRate ? current : best
  );

  // Deactivate weak variants
  const threshold = bestVariant.conversionRate * 0.7; // 70% of best
  const minSessions = 50; // Minimum sessions for statistical significance

  const deactivated: Array<{ variantId: number; name: string; conversionRate: number }> = [];
  const kept: Array<{ variantId: number; name: string; conversionRate: number }> = [];

  for (const variant of variantStats) {
    if (
      variant.variantId !== bestVariant.variantId && // Don't deactivate the best
      variant.totalSessions >= minSessions && // Has enough data
      variant.conversionRate < threshold // Below threshold
    ) {
      // Deactivate this variant
      await db
        .update(chatbotVariants)
        .set({ isActive: false })
        .where(eq(chatbotVariants.id, variant.variantId));

      deactivated.push({
        variantId: variant.variantId,
        name: variant.name,
        conversionRate: variant.conversionRate,
      });
    } else {
      kept.push({
        variantId: variant.variantId,
        name: variant.name,
        conversionRate: variant.conversionRate,
      });
    }
  }

  return { deactivated, kept };
}
