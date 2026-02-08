/**
 * Weekly Meta Description A/B Test Evaluation Scheduler
 * 
 * Runs every Sunday at 9:00 AM CET:
 * 1. Evaluates all active meta desc A/B tests
 * 2. Auto-deploys winners with high confidence
 * 3. Sends Telegram notification with results
 * 
 * Also runs a continuous check every 30 minutes for real-time
 * significance detection and instant notifications.
 */

import { autoEvaluateAndDeployMetaDesc, evaluateMetaDescTests, getActiveMetaDescTests, getMetaDescTestResults } from "./metaDescABTest";
import { sendTelegramMessage } from "./telegram";
import { notifyOwner } from "./_core/notification";

let schedulerStarted = false;

// Track which articles we've already notified about to avoid spam
const notifiedSignificant = new Set<string>();

/**
 * Run the weekly evaluation and deploy winners
 */
export async function runWeeklyMetaDescEvaluation(): Promise<{
  success: boolean;
  evaluated: number;
  deployed: number;
  message: string;
}> {
  console.log("[MetaDesc Weekly] Starting weekly meta description A/B test evaluation...");

  try {
    // Get active tests count
    const activeTests = await getActiveMetaDescTests();
    console.log(`[MetaDesc Weekly] Found ${activeTests.length} articles with active tests`);

    if (activeTests.length === 0) {
      const msg = "Žádné aktivní meta description A/B testy k vyhodnocení.";
      console.log(`[MetaDesc Weekly] ${msg}`);
      return { success: true, evaluated: 0, deployed: 0, message: msg };
    }

    // Auto-evaluate with lower threshold for weekly check (90% confidence)
    const result = await autoEvaluateAndDeployMetaDesc(50, 0.90);

    // Build report
    const report = buildWeeklyReport(activeTests, result);

    // Send Telegram notification
    await sendTelegramMessage(report.telegram).catch(err => {
      console.error("[MetaDesc Weekly] Telegram notification failed:", err);
    });

    // Also notify owner via built-in notification
    await notifyOwner({
      title: "📊 Týdenní vyhodnocení Meta Desc A/B testů",
      content: report.plain,
    }).catch(err => {
      console.error("[MetaDesc Weekly] Owner notification failed:", err);
    });

    console.log(`[MetaDesc Weekly] ✅ Evaluated: ${result.evaluated}, Deployed: ${result.deployed}`);

    return {
      success: true,
      evaluated: result.evaluated,
      deployed: result.deployed,
      message: `Vyhodnoceno ${result.evaluated} testů, nasazeno ${result.deployed} vítězů.`,
    };
  } catch (error) {
    console.error("[MetaDesc Weekly] Error:", error);
    
    await sendTelegramMessage(
      `❌ *Meta Desc Weekly Evaluation Failed*\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`
    ).catch(() => {});

    return { success: false, evaluated: 0, deployed: 0, message: "Chyba při vyhodnocení" };
  }
}

/**
 * Check for newly significant results (real-time detection)
 */
export async function checkForSignificantResults(): Promise<void> {
  try {
    // Evaluate with strict threshold (95% confidence) but lower impression minimum
    const winners = await evaluateMetaDescTests(30, 0.95);

    for (const w of winners) {
      const key = `${w.articleSlug}:${w.winner.variantKey}`;
      
      if (!notifiedSignificant.has(key)) {
        notifiedSignificant.add(key);

        const message = [
          `🎯 *Meta Desc A/B Test - Statisticky signifikantní výsledek!*`,
          ``,
          `📝 Článek: \`${w.articleSlug}\``,
          `🏆 Vítěz: ${w.winner.variantKey} (CTR: ${w.winner.ctr.toFixed(1)}%)`,
          `📉 Poražený: ${w.loser.variantKey} (CTR: ${w.loser.ctr.toFixed(1)}%)`,
          `📊 Jistota: ${w.winner.confidence}%`,
          ``,
          `💡 ${w.recommendation}`,
          ``,
          `_Automatický deploy proběhne při týdenním vyhodnocení (neděle 9:00)._`,
          `_Nebo nasaďte ručně v admin panelu: /admin/meta-desc-ab_`,
        ].join("\n");

        await sendTelegramMessage(message).catch(err => {
          console.error("[MetaDesc Realtime] Telegram notification failed:", err);
        });

        await notifyOwner({
          title: `🎯 Meta Desc A/B Test signifikantní: ${w.articleSlug}`,
          content: `Vítěz: ${w.winner.variantKey} (CTR ${w.winner.ctr.toFixed(1)}% vs ${w.loser.ctr.toFixed(1)}%, jistota ${w.winner.confidence}%)`,
        }).catch(() => {});

        console.log(`[MetaDesc Realtime] 🎯 Significant result for ${w.articleSlug}: ${w.winner.variantKey} wins`);
      }
    }
  } catch (error) {
    // Silent fail for background check
    console.error("[MetaDesc Realtime] Error checking significance:", error);
  }
}

/**
 * Get performance snapshot for all active tests (used by visualization)
 */
export async function getPerformanceSnapshot(): Promise<Array<{
  articleSlug: string;
  variantKey: string;
  impressions: number;
  clicks: number;
  ctr: number;
  completionRate: number;
  timestamp: number;
}>> {
  const results = await getMetaDescTestResults();
  
  return results.map(r => ({
    articleSlug: r.articleSlug,
    variantKey: r.variantKey,
    impressions: r.impressions,
    clicks: r.clicks,
    ctr: r.impressions > 0 ? (r.clicks / r.impressions) * 100 : 0,
    completionRate: r.completionRate,
    timestamp: Date.now(),
  }));
}

function buildWeeklyReport(
  activeTests: string[],
  result: { evaluated: number; deployed: number; results: Array<{ articleSlug: string; winner: string; confidence: number; deployed: boolean }> }
): { telegram: string; plain: string } {
  const lines: string[] = [
    `📊 *Týdenní vyhodnocení Meta Description A/B testů*`,
    ``,
    `📈 Aktivní testy: ${activeTests.length} článků`,
    `🏆 Signifikantní výsledky: ${result.evaluated}`,
    `🚀 Automaticky nasazeno: ${result.deployed}`,
  ];

  if (result.results.length > 0) {
    lines.push(``, `*Detaily:*`);
    for (const r of result.results) {
      const status = r.deployed ? "✅ Nasazeno" : "⚠️ Čeká na deploy";
      lines.push(`• \`${r.articleSlug}\`: ${r.winner} (${r.confidence}% jistota) - ${status}`);
    }
  }

  if (result.evaluated === 0) {
    lines.push(``, `ℹ️ Žádný test zatím nedosáhl statistické signifikance. Testy pokračují.`);
  }

  lines.push(``, `_Další vyhodnocení: příští neděle 9:00_`);

  const telegram = lines.join("\n");
  const plain = telegram.replace(/\*/g, "").replace(/_/g, "").replace(/`/g, "");

  return { telegram, plain };
}

/**
 * Start the scheduler
 */
export function scheduleMetaDescEvaluation(): void {
  if (schedulerStarted) return;
  schedulerStarted = true;

  // Weekly evaluation check (every 5 minutes, triggers on Sunday 9:00 AM)
  const checkWeekly = async () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Sunday at 9:00 AM (with 5 minute window)
    if (dayOfWeek === 0 && hours === 9 && minutes >= 0 && minutes < 5) {
      await runWeeklyMetaDescEvaluation();
    }
  };

  // Real-time significance check (every 30 minutes)
  const checkRealtime = async () => {
    await checkForSignificantResults();
  };

  // Run weekly check every 5 minutes
  setInterval(checkWeekly, 5 * 60 * 1000);

  // Run real-time significance check every 30 minutes
  setInterval(checkRealtime, 30 * 60 * 1000);

  // Run initial check after 1 minute startup delay
  setTimeout(checkRealtime, 60 * 1000);

  console.log("[MetaDesc Scheduler] ✅ Weekly evaluation: Sunday 9:00 AM");
  console.log("[MetaDesc Scheduler] ✅ Real-time significance check: every 30 min");
}

// Auto-start when module loads
scheduleMetaDescEvaluation();
