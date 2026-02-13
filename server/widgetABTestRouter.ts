import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { 
  widgetVariants, 
  widgetImpressions, 
  widgetInteractions, 
  widgetConversions,
  widgetDailyStats,
  widgetABTestResults,
} from "../drizzle/schema";
import { eq, and, sql, desc, gte, lte, count, sum, avg } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Vybere náhodnou variantu widgetu na základě vah
 */
async function selectRandomVariant(widgetKey: string) {
  const db = await getDb();
  
  // Získat všechny aktivní varianty pro daný widget
  const variants = await db
    .select()
    .from(widgetVariants)
    .where(
      and(
        eq(widgetVariants.widgetKey, widgetKey),
        eq(widgetVariants.isActive, true)
      )
    );

  if (variants.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No active variants found for widget: ${widgetKey}`,
    });
  }

  // Pokud je jen jedna varianta, vrátit ji
  if (variants.length === 1) {
    return variants[0];
  }

  // Vypočítat celkovou váhu
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  
  // Náhodný výběr na základě vah
  let random = Math.random() * totalWeight;
  
  for (const variant of variants) {
    random -= variant.weight;
    if (random <= 0) {
      return variant;
    }
  }
  
  // Fallback na první variantu (nemělo by se stát)
  return variants[0];
}

/**
 * Vypočítat statistickou signifikanci mezi dvěma variantami (Z-test pro proporce)
 */
function calculateStatisticalSignificance(
  conversions1: number,
  impressions1: number,
  conversions2: number,
  impressions2: number
): { pValue: number; isSignificant: boolean; confidence: number } {
  // Konverzní poměry
  const p1 = impressions1 > 0 ? conversions1 / impressions1 : 0;
  const p2 = impressions2 > 0 ? conversions2 / impressions2 : 0;
  
  // Pooled proportion
  const pPool = (conversions1 + conversions2) / (impressions1 + impressions2);
  
  // Standard error
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / impressions1 + 1 / impressions2));
  
  // Z-score
  const z = Math.abs(p1 - p2) / se;
  
  // P-value (two-tailed test)
  // Aproximace pomocí normálního rozdělení
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));
  
  // Statistická signifikance při α = 0.05
  const isSignificant = pValue < 0.05;
  
  // Confidence level
  const confidence = 1 - pValue;
  
  return { pValue, isSignificant, confidence };
}

/**
 * Cumulative distribution function pro normální rozdělení
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

export const widgetABTestRouter = router({
  /**
   * Získat variantu widgetu pro zobrazení
   */
  getVariant: publicProcedure
    .input(z.object({
      widgetKey: z.string(),
    }))
    .query(async ({ input }) => {
      const variant = await selectRandomVariant(input.widgetKey);
      return variant;
    }),

  /**
   * Zaznamenat zobrazení widgetu
   */
  trackImpression: publicProcedure
    .input(z.object({
      variantId: z.number(),
      widgetKey: z.string(),
      variantKey: z.string(),
      visitorId: z.string(),
      sessionId: z.string(),
      page: z.string(),
      referrer: z.string().optional(),
      device: z.string().optional(),
      browser: z.string().optional(),
      language: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      const [result] = await db.insert(widgetImpressions).values({
        variantId: input.variantId,
        widgetKey: input.widgetKey,
        variantKey: input.variantKey,
        visitorId: input.visitorId,
        sessionId: input.sessionId,
        page: input.page,
        referrer: input.referrer || null,
        device: input.device || null,
        browser: input.browser || null,
        language: input.language || null,
      });
      
      return { impressionId: Number(result.insertId) };
    }),

  /**
   * Zaznamenat interakci s widgetem
   */
  trackInteraction: publicProcedure
    .input(z.object({
      impressionId: z.number().optional(),
      variantId: z.number(),
      widgetKey: z.string(),
      variantKey: z.string(),
      visitorId: z.string(),
      sessionId: z.string(),
      interactionType: z.string(),
      interactionTarget: z.string().optional(),
      interactionValue: z.string().optional(),
      timeToInteraction: z.number().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      const [result] = await db.insert(widgetInteractions).values({
        impressionId: input.impressionId || null,
        variantId: input.variantId,
        widgetKey: input.widgetKey,
        variantKey: input.variantKey,
        visitorId: input.visitorId,
        sessionId: input.sessionId,
        interactionType: input.interactionType,
        interactionTarget: input.interactionTarget || null,
        interactionValue: input.interactionValue || null,
        timeToInteraction: input.timeToInteraction || null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      });
      
      return { interactionId: Number(result.insertId) };
    }),

  /**
   * Zaznamenat konverzi
   */
  trackConversion: publicProcedure
    .input(z.object({
      impressionId: z.number().optional(),
      interactionId: z.number().optional(),
      variantId: z.number(),
      widgetKey: z.string(),
      variantKey: z.string(),
      visitorId: z.string(),
      sessionId: z.string(),
      conversionType: z.string(),
      conversionValue: z.number().optional(),
      currency: z.string().optional(),
      timeToConversion: z.number().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      const [result] = await db.insert(widgetConversions).values({
        impressionId: input.impressionId || null,
        interactionId: input.interactionId || null,
        variantId: input.variantId,
        widgetKey: input.widgetKey,
        variantKey: input.variantKey,
        visitorId: input.visitorId,
        sessionId: input.sessionId,
        conversionType: input.conversionType,
        conversionValue: input.conversionValue?.toString() || null,
        currency: input.currency || "CZK",
        timeToConversion: input.timeToConversion || null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      });
      
      return { conversionId: Number(result.insertId) };
    }),

  /**
   * Získat všechny varianty pro daný widget
   */
  getVariants: publicProcedure
    .input(z.object({
      widgetKey: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      const variants = await db
        .select()
        .from(widgetVariants)
        .where(eq(widgetVariants.widgetKey, input.widgetKey))
        .orderBy(desc(widgetVariants.createdAt));
      
      return variants;
    }),

  /**
   * Získat statistiky pro widget
   */
  getWidgetStats: publicProcedure
    .input(z.object({
      widgetKey: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      // Získat všechny varianty
      const variants = await db
        .select()
        .from(widgetVariants)
        .where(eq(widgetVariants.widgetKey, input.widgetKey));
      
      const stats = [];
      
      for (const variant of variants) {
        // Počet zobrazení
        const impressionsResult = await db
          .select({ count: count() })
          .from(widgetImpressions)
          .where(eq(widgetImpressions.variantId, variant.id));
        
        const totalImpressions = impressionsResult[0]?.count || 0;
        
        // Počet interakcí
        const interactionsResult = await db
          .select({ count: count() })
          .from(widgetInteractions)
          .where(eq(widgetInteractions.variantId, variant.id));
        
        const totalInteractions = interactionsResult[0]?.count || 0;
        
        // Počet konverzí
        const conversionsResult = await db
          .select({ 
            count: count(),
            totalValue: sum(widgetConversions.conversionValue),
          })
          .from(widgetConversions)
          .where(eq(widgetConversions.variantId, variant.id));
        
        const totalConversions = conversionsResult[0]?.count || 0;
        const totalValue = parseFloat(conversionsResult[0]?.totalValue?.toString() || "0");
        
        // Vypočítat míry
        const interactionRate = totalImpressions > 0 ? totalInteractions / totalImpressions : 0;
        const conversionRate = totalImpressions > 0 ? totalConversions / totalImpressions : 0;
        const avgConversionValue = totalConversions > 0 ? totalValue / totalConversions : 0;
        
        stats.push({
          variant,
          totalImpressions,
          totalInteractions,
          totalConversions,
          interactionRate,
          conversionRate,
          totalValue,
          avgConversionValue,
        });
      }
      
      // Vypočítat statistickou signifikanci mezi variantami
      if (stats.length === 2) {
        const [variant1, variant2] = stats;
        const significance = calculateStatisticalSignificance(
          variant1.totalConversions,
          variant1.totalImpressions,
          variant2.totalConversions,
          variant2.totalImpressions
        );
        
        return {
          variants: stats,
          significance,
        };
      }
      
      return {
        variants: stats,
        significance: null,
      };
    }),

  /**
   * Vytvořit novou variantu widgetu
   */
  createVariant: publicProcedure
    .input(z.object({
      widgetKey: z.string(),
      variantKey: z.string(),
      name: z.string(),
      description: z.string().optional(),
      config: z.record(z.any()),
      weight: z.number().default(50),
      isControl: z.boolean().default(false),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      
      // Zkontrolovat, zda varianta již existuje
      const existing = await db
        .select()
        .from(widgetVariants)
        .where(
          and(
            eq(widgetVariants.widgetKey, input.widgetKey),
            eq(widgetVariants.variantKey, input.variantKey)
          )
        );
      
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Variant with this key already exists",
        });
      }
      
      const [result] = await db.insert(widgetVariants).values({
        widgetKey: input.widgetKey,
        variantKey: input.variantKey,
        name: input.name,
        description: input.description || null,
        config: JSON.stringify(input.config),
        weight: input.weight,
        isControl: input.isControl,
        isActive: true,
        createdBy: ctx.user?.name || "system",
        notes: input.notes || null,
      });
      
      return { variantId: Number(result.insertId) };
    }),

  /**
   * Aktualizovat variantu widgetu
   */
  updateVariant: publicProcedure
    .input(z.object({
      variantId: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      config: z.record(z.any()).optional(),
      weight: z.number().optional(),
      isActive: z.boolean().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      const updateData: any = {};
      
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.config !== undefined) updateData.config = JSON.stringify(input.config);
      if (input.weight !== undefined) updateData.weight = input.weight;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;
      if (input.notes !== undefined) updateData.notes = input.notes;
      
      await db
        .update(widgetVariants)
        .set(updateData)
        .where(eq(widgetVariants.id, input.variantId));
      
      return { success: true };
    }),

  /**
   * Získat denní statistiky pro widget
   */
  getDailyStats: publicProcedure
    .input(z.object({
      widgetKey: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      const stats = await db
        .select()
        .from(widgetDailyStats)
        .where(
          and(
            eq(widgetDailyStats.widgetKey, input.widgetKey),
            gte(widgetDailyStats.date, new Date(input.startDate)),
            lte(widgetDailyStats.date, new Date(input.endDate))
          )
        )
        .orderBy(widgetDailyStats.date);
      
      return stats;
    }),
});
