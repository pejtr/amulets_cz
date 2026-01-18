import { getDb } from "../db";
import { chatbotVariants, chatbotSessions, chatbotMessages, chatbotDailyStats, chatbotConversions } from "../../drizzle/schema";
import { eq, and, gte, lt, sql } from "drizzle-orm";

/**
 * Agreguje denní statistiky pro A/B testování chatbota
 * Spouští se jednou denně (ideálně v noci)
 */
export async function aggregateDailyStats(date?: Date) {
  const db = await getDb();
  if (!db) {
    console.error("[DailyStats] Database not available");
    return;
  }

  // Použij včerejší datum pokud není specifikováno
  const targetDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000);
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  console.log(`[DailyStats] Aggregating stats for ${startOfDay.toISOString().split('T')[0]}`);

  try {
    // Získej všechny aktivní varianty
    const variants = await db.select().from(chatbotVariants).where(eq(chatbotVariants.isActive, true));

    for (const variant of variants) {
      // Získej sessions pro tento den a variantu
      const sessions = await db.select()
        .from(chatbotSessions)
        .where(
          and(
            eq(chatbotSessions.variantId, variant.id),
            gte(chatbotSessions.startedAt, startOfDay),
            lt(chatbotSessions.startedAt, endOfDay)
          )
        );

      if (sessions.length === 0) {
        console.log(`[DailyStats] No sessions for variant ${variant.name} on ${startOfDay.toISOString().split('T')[0]}`);
        continue;
      }

      // Spočítej statistiky
      const totalSessions = sessions.length;
      const totalMessages = sessions.reduce((sum, s) => sum + (s.messageCount || 0), 0);
      const totalUserMessages = sessions.reduce((sum, s) => sum + (s.userMessageCount || 0), 0);
      const totalBotMessages = sessions.reduce((sum, s) => sum + (s.botMessageCount || 0), 0);
      const totalCategoryClicks = sessions.reduce((sum, s) => sum + (s.categoryClicks || 0), 0);
      const totalQuestionClicks = sessions.reduce((sum, s) => sum + (s.questionClicks || 0), 0);
      
      // Konverze
      const convertedSessions = sessions.filter(s => s.converted);
      const totalConversions = convertedSessions.length;
      const totalConversionValue = convertedSessions.reduce((sum, s) => sum + (parseFloat(s.conversionValue?.toString() || '0')), 0);
      const conversionRate = totalSessions > 0 ? totalConversions / totalSessions : 0;

      // Bounce rate (sessions s 0 nebo 1 zprávou)
      const bouncedSessions = sessions.filter(s => (s.userMessageCount || 0) <= 1);
      const totalBounces = bouncedSessions.length;
      const bounceRate = totalSessions > 0 ? totalBounces / totalSessions : 0;

      // Průměrná délka session
      const sessionsWithDuration = sessions.filter(s => s.duration && s.duration > 0);
      const avgSessionDuration = sessionsWithDuration.length > 0
        ? Math.round(sessionsWithDuration.reduce((sum, s) => sum + (s.duration || 0), 0) / sessionsWithDuration.length)
        : 0;

      // Průměrný počet zpráv
      const avgMessagesPerSession = totalSessions > 0 ? (totalMessages / totalSessions).toFixed(2) : "0";

      // Sentiment
      const positiveSentimentCount = sessions.filter(s => s.overallSentiment === 'positive').length;
      const negativeSentimentCount = sessions.filter(s => s.overallSentiment === 'negative').length;
      const neutralSentimentCount = sessions.filter(s => s.overallSentiment === 'neutral' || !s.overallSentiment).length;

      // Satisfaction score
      const sessionsWithScore = sessions.filter(s => s.satisfactionScore && s.satisfactionScore > 0);
      const avgSatisfactionScore = sessionsWithScore.length > 0
        ? (sessionsWithScore.reduce((sum, s) => sum + (s.satisfactionScore || 0), 0) / sessionsWithScore.length).toFixed(2)
        : "0";

      // Ulož nebo aktualizuj denní statistiky
      await db.insert(chatbotDailyStats).values({
        variantId: variant.id,
        date: startOfDay,
        totalSessions,
        totalMessages,
        totalUserMessages,
        totalBotMessages,
        avgSessionDuration,
        avgMessagesPerSession,
        totalCategoryClicks,
        totalQuestionClicks,
        totalConversions,
        totalConversionValue: totalConversionValue.toFixed(2),
        conversionRate: conversionRate.toFixed(4),
        totalBounces,
        bounceRate: bounceRate.toFixed(4),
        positiveSentimentCount,
        negativeSentimentCount,
        neutralSentimentCount,
        avgSatisfactionScore,
      }).onDuplicateKeyUpdate({
        set: {
          totalSessions,
          totalMessages,
          totalUserMessages,
          totalBotMessages,
          avgSessionDuration,
          avgMessagesPerSession,
          totalCategoryClicks,
          totalQuestionClicks,
          totalConversions,
          totalConversionValue: totalConversionValue.toFixed(2),
          conversionRate: conversionRate.toFixed(4),
          totalBounces,
          bounceRate: bounceRate.toFixed(4),
          positiveSentimentCount,
          negativeSentimentCount,
          neutralSentimentCount,
          avgSatisfactionScore,
        },
      });

      console.log(`[DailyStats] ✅ Variant ${variant.name}: ${totalSessions} sessions, ${totalConversions} conversions (${(conversionRate * 100).toFixed(1)}%)`);
    }

    console.log(`[DailyStats] ✅ Daily aggregation complete for ${startOfDay.toISOString().split('T')[0]}`);
  } catch (error) {
    console.error("[DailyStats] Error aggregating stats:", error);
    throw error;
  }
}

// Spustit pokud je voláno přímo
if (import.meta.url === `file://${process.argv[1]}`) {
  aggregateDailyStats().then(() => {
    console.log("Done!");
    process.exit(0);
  }).catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
}
