import { autoDeactivateWeakVariants } from "../abTestAutoDeactivate";
import { sendTelegramMessage } from "../telegram";

/**
 * Týdenní úklid A/B testů - automaticky deaktivuje slabé varianty
 * Spouští se každé pondělí v 9:00
 */
export async function weeklyABTestCleanup() {
  console.log("[WeeklyABTestCleanup] Starting weekly A/B test cleanup...");

  try {
    const result = await autoDeactivateWeakVariants();

    if (result.deactivated.length > 0) {
      console.log(`[WeeklyABTestCleanup] Deactivated ${result.deactivated.length} weak variants:`, result.deactivated);

      // Send Telegram notification
      const message = `
🧪 <b>TÝDENNÍ A/B TEST CLEANUP</b>

Automaticky deaktivováno <b>${result.deactivated.length}</b> slabých variant:

${result.deactivated.map(v => `• ${v.name}: ${v.conversionRate.toFixed(2)}%`).join('\n')}

Aktivní varianty (${result.kept.length}):
${result.kept.map(v => `• ${v.name}: ${v.conversionRate.toFixed(2)}%`).join('\n')}
      `.trim();

      await sendTelegramMessage(message);
    } else {
      console.log("[WeeklyABTestCleanup] No weak variants found, all variants performing well");
      
      // Send success notification
      const message = `
🧪 <b>TÝDENNÍ A/B TEST CLEANUP</b>

✅ Všechny varianty mají dobrý výkon, žádná nebyla deaktivována.

Aktivní varianty (${result.kept.length}):
${result.kept.map(v => `• ${v.name}: ${v.conversionRate.toFixed(2)}%`).join('\n')}
      `.trim();

      await sendTelegramMessage(message);
    }

    console.log("[WeeklyABTestCleanup] Weekly A/B test cleanup completed successfully");
    return { success: true, deactivated: result.deactivated.length };
  } catch (error) {
    console.error("[WeeklyABTestCleanup] Error during weekly A/B test cleanup:", error);
    
    // Send error notification
    await sendTelegramMessage(`
🧪 <b>TÝDENNÍ A/B TEST CLEANUP - CHYBA</b>

❌ Chyba při automatické deaktivaci variant:
${error instanceof Error ? error.message : String(error)}
    `.trim());

    return { success: false, error: String(error) };
  }
}
