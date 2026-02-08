/**
 * Scheduled Headline A/B Test Evaluation & Auto-Generation
 * 
 * - Weekly evaluation of active headline tests
 * - Auto-deploy winners when statistically significant
 * - Auto-generate new variants for articles without active tests
 * - Notifications via Telegram + owner notification
 */

import { getActiveHeadlineTests, evaluateHeadlineTests, deployWinningVariant, getHeadlineTestResults } from "./headlineABTest";
import { generateAndCreateTest } from "./aiHeadlineGenerator";
import { notifyOwner } from "./_core/notification";
import { sendTelegramMessage } from "./telegram";

// Articles that should always have active headline tests
const PRIORITY_ARTICLES = [
  { slug: "trojity-mesic", type: "guide" as const, title: "Trojitý měsíc", category: "symboly" },
  { slug: "symbol-nesmrtelnosti", type: "guide" as const, title: "Symbol nesmrtelnosti", category: "symboly" },
  { slug: "aromaterapie-esence", type: "magazine" as const, title: "Aromaterapeutické esence", category: "wellness" },
  { slug: "cinsky-horoskop", type: "guide" as const, title: "Čínský horoskop", category: "horoskopy" },
  { slug: "tantricka-masaz-pro-pary", type: "magazine" as const, title: "Tantrická masáž pro páry", category: "tantra" },
];

/**
 * Run weekly headline evaluation:
 * 1. Evaluate all active tests
 * 2. Deploy winners with >95% confidence
 * 3. Auto-generate new tests for priority articles without active tests
 */
export async function runWeeklyHeadlineEvaluation(): Promise<{
  evaluated: number;
  deployed: number;
  newTestsCreated: number;
  notifications: string[];
}> {
  const notifications: string[] = [];
  let evaluated = 0;
  let deployed = 0;
  let newTestsCreated = 0;

  try {
    // 1. Get active tests
    const activeTests = await getActiveHeadlineTests();
    evaluated = activeTests.length;

    // 2. Evaluate and find winners
    const results = await evaluateHeadlineTests();
    
    for (const result of results) {
      if (result.winner && result.winner.confidence >= 0.95) {
        // Deploy the winner
        try {
          await deployWinningVariant(result.articleSlug, result.winner.variantKey);
          deployed++;
          
          const msg = `🏆 Headline vítěz: "${result.winner.headline}" pro ${result.articleSlug} (CTR: ${(result.winner.ctr * 100).toFixed(1)}%, confidence: ${(result.winner.confidence * 100).toFixed(0)}%)`;
          notifications.push(msg);
        } catch (e) {
          notifications.push(`⚠️ Nepodařilo se nasadit vítěze pro ${result.articleSlug}: ${(e as Error).message}`);
        }
      }
    }

    // 3. Auto-generate new tests for priority articles without active tests
    const activeArticleSlugs = new Set(activeTests); // getActiveHeadlineTests returns string[]
    
    for (const article of PRIORITY_ARTICLES) {
      if (!activeArticleSlugs.has(article.slug)) {
        try {
          await generateAndCreateTest(
            article.slug,
            article.title,
            `Článek o tématu: ${article.title}. Kategorie: ${article.category}.`,
            article.type,
            2,
          );
          newTestsCreated++;
          notifications.push(`🆕 Nový headline test vytvořen pro: ${article.title}`);
        } catch (e) {
          notifications.push(`⚠️ Nepodařilo se vytvořit test pro ${article.title}: ${(e as Error).message}`);
        }
      }
    }

    // 4. Send notifications
    if (notifications.length > 0) {
      const summary = [
        `📊 **Týdenní headline A/B test report**`,
        ``,
        `Vyhodnoceno: ${evaluated} testů`,
        `Nasazeno vítězů: ${deployed}`,
        `Nové testy: ${newTestsCreated}`,
        ``,
        ...notifications,
      ].join('\n');

      // Notify owner
      await notifyOwner({
        title: "Headline A/B Test - Týdenní report",
        content: summary,
      });

      // Telegram
      await sendTelegramMessage(summary);
    }

  } catch (error) {
    const errMsg = `❌ Chyba při headline evaluaci: ${(error as Error).message}`;
    notifications.push(errMsg);
    console.error("[HeadlineEvaluation]", error);
  }

  return { evaluated, deployed, newTestsCreated, notifications };
}

/**
 * Check for statistically significant headline results (runs more frequently)
 */
export async function checkHeadlineSignificance(): Promise<{
  significantTests: Array<{ articleSlug: string; winner: string; confidence: number }>;
}> {
  const significantTests: Array<{ articleSlug: string; winner: string; confidence: number }> = [];

  try {
    const results = await evaluateHeadlineTests();
    
    for (const result of results) {
      if (result.winner && result.winner.confidence >= 0.95) {
        significantTests.push({
          articleSlug: result.articleSlug,
          winner: result.winner.headline,
          confidence: result.winner.confidence,
        });
      }
    }

    // Notify if any significant results found
    if (significantTests.length > 0) {
      const msg = significantTests.map(t => 
        `✅ ${t.articleSlug}: "${t.winner}" (${(t.confidence * 100).toFixed(0)}% confidence)`
      ).join('\n');

      await sendTelegramMessage(`🎯 **Headline signifikance dosažena!**\n\n${msg}`);
    }
  } catch (error) {
    console.error("[HeadlineSignificanceCheck]", error);
  }

  return { significantTests };
}

/**
 * Schedule the weekly evaluation and periodic significance checks
 */
export function scheduleHeadlineEvaluation() {
  // Weekly full evaluation - Sunday at 10:00 (after meta desc eval at 9:00)
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
  nextSunday.setHours(10, 0, 0, 0);
  if (nextSunday <= now) nextSunday.setDate(nextSunday.getDate() + 7);
  
  const msUntilSunday = nextSunday.getTime() - now.getTime();
  
  setTimeout(() => {
    runWeeklyHeadlineEvaluation();
    setInterval(() => runWeeklyHeadlineEvaluation(), WEEK_MS);
  }, msUntilSunday);

  // Significance check every 30 minutes
  setInterval(() => checkHeadlineSignificance(), 30 * 60 * 1000);

  console.log(`[HeadlineEvaluation] Scheduled: weekly eval Sunday 10:00, significance check every 30min`);
}

// Auto-start on import
scheduleHeadlineEvaluation();
