/**
 * OHORAI Synchronization Code
 * 
 * Tento soubor obsahuje kompletní kód pro implementaci hodinové synchronizace
 * statistik z OHORAI marketplace do Amulets.cz.
 * 
 * INSTRUKCE:
 * 1. Zkopírujte tento soubor do OHORAI projektu jako server/sync.ts
 * 2. Přidejte environment proměnné (viz níže)
 * 3. Importujte a spusťte v server/_core/index.ts
 */

// ============================================
// ENVIRONMENT PROMĚNNÉ (přidat do .env)
// ============================================
// AMULETS_API_URL=https://amulets.cz
// SHARED_BRAIN_API_KEY=váš-sdílený-klíč

// ============================================
// TYPY
// ============================================

interface SyncStats {
  totalConversations: number;
  totalMessages: number;
  uniqueVisitors: number;
  streamSelections?: {
    hmotne?: number;
    etericke?: number;
    uzitecne?: number;
  };
  popularTopics?: string[];
  leadsCollected?: number;
}

interface SyncResult {
  success: boolean;
  message: string;
  timestamp: Date;
}

// ============================================
// HLAVNÍ SYNCHRONIZAČNÍ FUNKCE
// ============================================

/**
 * Synchronizuje aktuální statistiky s Amulets.cz
 * Volat každou hodinu pro aktuální reporty
 */
export async function syncStatsToAmulets(): Promise<SyncResult> {
  const apiUrl = process.env.AMULETS_API_URL || 'https://amulets.cz';
  const apiKey = process.env.SHARED_BRAIN_API_KEY;
  
  if (!apiKey) {
    console.warn('[OHORAI Sync] API key not configured');
    return {
      success: false,
      message: 'API key not configured',
      timestamp: new Date(),
    };
  }
  
  const dateStr = new Date().toISOString().split('T')[0];
  
  try {
    // Získat aktuální statistiky z OHORAI databáze
    const stats = await getCurrentOhoraiStats();
    
    console.log(`[OHORAI Sync] Sending stats for ${dateStr}:`, stats);
    
    const response = await fetch(`${apiUrl}/api/trpc/shared.syncStats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: 'ohorai',
        apiKey,
        date: dateStr,
        stats,
      }),
    });
    
    const data = await response.json();
    
    if (data.result?.data?.success) {
      console.log(`[OHORAI Sync] ✅ Stats synced successfully for ${dateStr}`);
      return {
        success: true,
        message: data.result.data.message,
        timestamp: new Date(),
      };
    } else {
      console.error('[OHORAI Sync] ❌ Sync failed:', data);
      return {
        success: false,
        message: data.error?.message || 'Unknown error',
        timestamp: new Date(),
      };
    }
  } catch (error) {
    console.error('[OHORAI Sync] ❌ Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
      timestamp: new Date(),
    };
  }
}

// ============================================
// HELPER FUNKCE - IMPLEMENTOVAT V OHORAI
// ============================================

/**
 * Získat aktuální statistiky z OHORAI databáze
 * TUTO FUNKCI MUSÍTE IMPLEMENTOVAT podle vaší databáze
 */
async function getCurrentOhoraiStats(): Promise<SyncStats> {
  // TODO: Implementovat podle vaší databáze
  // Příklad pro Drizzle ORM:
  
  /*
  const db = await getDb();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Počet konverzací dnes
  const sessions = await db.select({ count: count() })
    .from(chatbotSessions)
    .where(gte(chatbotSessions.createdAt, today));
  
  // Počet zpráv dnes
  const messages = await db.select({ count: count() })
    .from(chatbotMessages)
    .where(gte(chatbotMessages.createdAt, today));
  
  // Unikátní návštěvníci
  const visitors = await db.selectDistinct({ visitorId: chatbotSessions.visitorId })
    .from(chatbotSessions)
    .where(gte(chatbotSessions.createdAt, today));
  
  // Volby proudů (pokud trackujete)
  const streamEvents = await db.select()
    .from(chatbotEvents)
    .where(and(
      eq(chatbotEvents.eventType, 'stream_selected'),
      gte(chatbotEvents.createdAt, today)
    ));
  
  const streamSelections = {
    hmotne: streamEvents.filter(e => JSON.parse(e.eventData || '{}').stream === 'hmotne').length,
    etericke: streamEvents.filter(e => JSON.parse(e.eventData || '{}').stream === 'etericke').length,
    uzitecne: streamEvents.filter(e => JSON.parse(e.eventData || '{}').stream === 'uzitecne').length,
  };
  
  // Emaily zachycené
  const leads = await db.select({ count: count() })
    .from(chatbotConversions)
    .where(and(
      eq(chatbotConversions.conversionType, 'email_capture'),
      gte(chatbotConversions.createdAt, today)
    ));
  
  return {
    totalConversations: sessions[0]?.count || 0,
    totalMessages: messages[0]?.count || 0,
    uniqueVisitors: visitors.length,
    streamSelections,
    leadsCollected: leads[0]?.count || 0,
  };
  */
  
  // Placeholder - nahradit skutečnou implementací
  return {
    totalConversations: 0,
    totalMessages: 0,
    uniqueVisitors: 0,
    streamSelections: {
      hmotne: 0,
      etericke: 0,
      uzitecne: 0,
    },
    leadsCollected: 0,
  };
}

// ============================================
// INICIALIZACE - PŘIDAT DO server/_core/index.ts
// ============================================

/**
 * Inicializovat hodinovou synchronizaci
 * Přidat do server/_core/index.ts:
 * 
 * import { initOhoraiSync } from '../sync';
 * initOhoraiSync();
 */
export function initOhoraiSync() {
  console.log('[OHORAI Sync] Initializing hourly sync...');
  
  // Spustit ihned při startu
  syncStatsToAmulets().then(result => {
    console.log('[OHORAI Sync] Initial sync:', result.success ? '✅' : '❌');
  });
  
  // Nastavit hodinový interval
  const ONE_HOUR = 60 * 60 * 1000;
  setInterval(() => {
    syncStatsToAmulets().then(result => {
      console.log('[OHORAI Sync] Hourly sync:', result.success ? '✅' : '❌');
    });
  }, ONE_HOUR);
  
  console.log('[OHORAI Sync] ✅ Hourly sync initialized');
}

// ============================================
// MANUÁLNÍ SYNC ENDPOINT (volitelné)
// ============================================

/**
 * Přidat do routers.ts pro manuální synchronizaci:
 * 
 * sync: router({
 *   triggerSync: protectedProcedure
 *     .mutation(async () => {
 *       const result = await syncStatsToAmulets();
 *       return result;
 *     }),
 * }),
 */

export default {
  syncStatsToAmulets,
  initOhoraiSync,
};
