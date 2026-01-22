import { getDb } from "./db";
import { chatbotVariants, chatbotSessions } from "../drizzle/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

/**
 * Získá denní trendy konverzních poměrů pro všechny varianty
 * za posledních X dní
 */
export async function getChatbotVariantTrends(days: number = 30): Promise<Array<{
  date: string;
  variants: Array<{
    variantId: number;
    variantName: string;
    conversionRate: number;
    sessions: number;
    conversions: number;
  }>;
}>> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all active variants
  const variants = await db
    .select()
    .from(chatbotVariants)
    .where(eq(chatbotVariants.isActive, true));

  if (variants.length === 0) {
    return [];
  }

  // Generate array of dates
  const dates: Date[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  // Get stats for each date and variant
  const trends = await Promise.all(
    dates.map(async (date) => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const variantStats = await Promise.all(
        variants.map(async (variant: any) => {
          const sessions = await db
            .select({
              totalSessions: sql<number>`COUNT(DISTINCT ${chatbotSessions.id})`,
              totalConversions: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END)`,
            })
            .from(chatbotSessions)
            .where(
              and(
                eq(chatbotSessions.variantId, variant.id),
                gte(chatbotSessions.createdAt, dayStart),
                lte(chatbotSessions.createdAt, dayEnd)
              )
            );

          const totalSessions = Number(sessions[0]?.totalSessions || 0);
          const totalConversions = Number(sessions[0]?.totalConversions || 0);
          const conversionRate = totalSessions > 0 
            ? (totalConversions / totalSessions) * 100 
            : 0;

          return {
            variantId: variant.id,
            variantName: variant.name,
            conversionRate: Number(conversionRate.toFixed(2)),
            sessions: totalSessions,
            conversions: totalConversions,
          };
        })
      );

      return {
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        variants: variantStats,
      };
    })
  );

  return trends;
}
