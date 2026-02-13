import { getDb } from "../db";
import { chatbotVariants, chatbotSessions, chatbotConversions } from "../../drizzle/schema";
import { eq, and, gte, lt, count, sum, avg, sql } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";

/**
 * Generuje denní report A/B testu chatbota a posílá notifikaci vlastníkovi
 */
export async function generateDailyReport(date?: Date) {
  const db = await getDb();
  if (!db) {
    console.error("[DailyReport] Database not available");
    return;
  }

  // Použij včerejší datum pokud není specifikováno
  const targetDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000);
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const dateStr = startOfDay.toLocaleDateString('cs-CZ', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  console.log(`[DailyReport] Generating report for ${dateStr}`);

  try {
    // Získej všechny aktivní varianty
    const variants = await db.select().from(chatbotVariants).where(eq(chatbotVariants.isActive, true));

    let reportContent = `# 📊 Denní report A/B testu chatbota\n\n`;
    reportContent += `**Datum:** ${dateStr}\n\n`;
    reportContent += `---\n\n`;

    let totalSessionsAll = 0;
    let totalConversionsAll = 0;
    let totalValueAll = 0;
    let bestVariant = { name: '', conversionRate: 0 };

    for (const variant of variants) {
      // Získej sessions pro tento den a variantu
      const [sessionsResult] = await db.select({
        total: count(chatbotSessions.id),
        avgDuration: avg(chatbotSessions.duration),
        avgMessages: avg(chatbotSessions.messageCount),
        conversions: sql<number>`SUM(CASE WHEN ${chatbotSessions.converted} = 1 THEN 1 ELSE 0 END)`,
        totalValue: sum(chatbotSessions.conversionValue),
      })
      .from(chatbotSessions)
      .where(
        and(
          eq(chatbotSessions.variantId, variant.id),
          gte(chatbotSessions.startedAt, startOfDay),
          lt(chatbotSessions.startedAt, endOfDay)
        )
      );

      const totalSessions = Number(sessionsResult?.total) || 0;
      const conversions = Number(sessionsResult?.conversions) || 0;
      const totalValue = Number(sessionsResult?.totalValue) || 0;
      const avgDuration = Math.round(Number(sessionsResult?.avgDuration) || 0);
      const avgMessages = Number(sessionsResult?.avgMessages)?.toFixed(1) || '0';
      const conversionRate = totalSessions > 0 ? (conversions / totalSessions * 100) : 0;

      totalSessionsAll += totalSessions;
      totalConversionsAll += conversions;
      totalValueAll += totalValue;

      if (conversionRate > bestVariant.conversionRate) {
        bestVariant = { name: variant.name, conversionRate };
      }

      // Získej konverze podle typu
      const conversionsByType = await db.select({
        type: chatbotConversions.conversionType,
        count: count(chatbotConversions.id),
      })
      .from(chatbotConversions)
      .where(
        and(
          eq(chatbotConversions.variantId, variant.id),
          gte(chatbotConversions.createdAt, startOfDay),
          lt(chatbotConversions.createdAt, endOfDay)
        )
      )
      .groupBy(chatbotConversions.conversionType);

      reportContent += `## ${variant.name}\n\n`;
      reportContent += `| Metrika | Hodnota |\n`;
      reportContent += `|---------|--------|\n`;
      reportContent += `| Sessions | ${totalSessions} |\n`;
      reportContent += `| Konverze | ${conversions} (${conversionRate.toFixed(1)}%) |\n`;
      reportContent += `| Hodnota konverzí | ${totalValue.toFixed(0)} Kč |\n`;
      reportContent += `| Prům. délka session | ${avgDuration}s |\n`;
      reportContent += `| Prům. počet zpráv | ${avgMessages} |\n\n`;

      if (conversionsByType.length > 0) {
        reportContent += `**Konverze podle typu:**\n`;
        for (const conv of conversionsByType) {
          const typeLabel = {
            'email_capture': '📧 Email',
            'whatsapp_click': '📱 WhatsApp',
            'affiliate_click': '🔗 Affiliate',
            'purchase': '💰 Nákup',
            'newsletter': '📰 Newsletter',
          }[conv.type] || conv.type;
          reportContent += `- ${typeLabel}: ${conv.count}\n`;
        }
        reportContent += `\n`;
      }

      reportContent += `---\n\n`;
    }

    // Souhrn
    const overallConversionRate = totalSessionsAll > 0 ? (totalConversionsAll / totalSessionsAll * 100) : 0;

    reportContent += `## 📈 Celkový souhrn\n\n`;
    reportContent += `| Metrika | Hodnota |\n`;
    reportContent += `|---------|--------|\n`;
    reportContent += `| Celkem sessions | ${totalSessionsAll} |\n`;
    reportContent += `| Celkem konverzí | ${totalConversionsAll} (${overallConversionRate.toFixed(1)}%) |\n`;
    reportContent += `| Celková hodnota | ${totalValueAll.toFixed(0)} Kč |\n`;
    reportContent += `| Nejlepší varianta | ${bestVariant.name} (${bestVariant.conversionRate.toFixed(1)}%) |\n\n`;

    // Statistická významnost
    if (totalSessionsAll >= 100) {
      reportContent += `✅ **Dostatečný vzorek pro statistickou analýzu**\n\n`;
    } else {
      reportContent += `⚠️ **Nedostatečný vzorek** - potřeba více sessions pro statisticky významné výsledky\n\n`;
    }

    // Pošli notifikaci vlastníkovi
    const notificationTitle = `📊 A/B Test Report: ${startOfDay.toLocaleDateString('cs-CZ')}`;
    const notificationContent = `Sessions: ${totalSessionsAll} | Konverze: ${totalConversionsAll} (${overallConversionRate.toFixed(1)}%) | Nejlepší: ${bestVariant.name}`;

    const sent = await notifyOwner({
      title: notificationTitle,
      content: notificationContent,
    });

    if (sent) {
      console.log(`[DailyReport] ✅ Notification sent to owner`);
    } else {
      console.log(`[DailyReport] ⚠️ Failed to send notification`);
    }

    console.log(`[DailyReport] ✅ Report generated for ${dateStr}`);
    console.log(reportContent);

    return {
      date: dateStr,
      totalSessions: totalSessionsAll,
      totalConversions: totalConversionsAll,
      totalValue: totalValueAll,
      overallConversionRate,
      bestVariant,
      reportContent,
    };
  } catch (error) {
    console.error("[DailyReport] Error generating report:", error);
    throw error;
  }
}

// Spustit pokud je voláno přímo
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDailyReport().then((result) => {
    console.log("Done!", result);
    process.exit(0);
  }).catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
}
