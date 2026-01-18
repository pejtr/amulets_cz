/**
 * Telegram Bot Integration - Natálie, osobní asistentka
 * 
 * Natálie je vaše pravá ruka pro Amulets.cz. Posílá denní reporty,
 * sleduje výkon webu a chatbota, a je tu pro vás kdykoliv potřebujete.
 */

import { getChatbotComparisonStats, getChatbotConversionStats, getAllChatbotVariants } from './db';
import { 
  getRandomGreeting as getSharedGreeting, 
  getRandomClosing as getSharedClosing, 
  NATALIE_IDENTITY 
} from '@shared/nataliePersonality';

// Telegram Bot Configuration
function getTelegramBotToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN;
}

function getTelegramChatId(): string | undefined {
  return process.env.TELEGRAM_CHAT_ID;
}

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_web_page_preview?: boolean;
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(message: string, parseMode: 'HTML' | 'Markdown' | 'MarkdownV2' = 'HTML'): Promise<boolean> {
  const botToken = getTelegramBotToken();
  const chatId = getTelegramChatId();
  
  if (!botToken || !chatId) {
    console.warn('[Telegram] Bot token or chat ID not configured. Token:', !!botToken, 'ChatId:', !!chatId);
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const payload: TelegramMessage = {
      chat_id: chatId,
      text: message,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('[Telegram] Failed to send message:', data.description);
      return false;
    }

    console.log('[Telegram] Message sent successfully');
    return true;
  } catch (error) {
    console.error('[Telegram] Error sending message:', error);
    return false;
  }
}

/**
 * Get random greeting for Telegram context
 */
function getRandomGreeting(): string {
  return getSharedGreeting('telegram', 'morning');
}

/**
 * Get random closing for Telegram context
 */
function getRandomClosing(): string {
  return getSharedClosing('telegram');
}

/**
 * Get performance comment based on stats
 */
function getPerformanceComment(totalSessions: number, conversionRate: number): string {
  if (totalSessions === 0) {
    return '📭 Včera bylo ticho, žádné nové sessions. Možná víkend nebo svátek?';
  }
  
  if (conversionRate >= 10) {
    return '🔥 Skvělý den! Konverzní poměr je nad 10%, to je super!';
  } else if (conversionRate >= 5) {
    return '👍 Solidní výsledky, konverze jsou v normě.';
  } else if (conversionRate >= 2) {
    return '📈 Prostor pro zlepšení, ale stále dobré.';
  } else if (totalSessions > 50) {
    return '🤔 Hodně návštěv, ale málo konverzí. Možná upravit chatbota?';
  }
  
  return '📊 Tady jsou včerejší čísla.';
}

/**
 * Generate daily chatbot report with Natálie's personality
 */
export async function generateDailyReport(): Promise<string> {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Get yesterday's stats
  const stats = await getChatbotComparisonStats(yesterday, today);
  const conversionStats = await getChatbotConversionStats(yesterday, today);
  const variants = await getAllChatbotVariants();

  // Calculate totals
  const totalSessions = stats.reduce((sum, s) => sum + Number(s.totalSessions || 0), 0);
  const totalMessages = stats.reduce((sum, s) => sum + Number(s.totalMessages || 0), 0);
  const totalConversions = stats.reduce((sum, s) => sum + Number(s.totalConversions || 0), 0);
  const overallConversionRate = totalSessions > 0 
    ? (totalConversions / totalSessions) * 100
    : 0;

  // Count conversions by type
  const conversionsByType: Record<string, number> = {};
  conversionStats.forEach((c: any) => {
    const type = c.conversionType;
    conversionsByType[type] = (conversionsByType[type] || 0) + Number(c.totalConversions || 0);
  });

  // Format date
  const dateStr = yesterday.toLocaleDateString('cs-CZ', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Build report message with Natálie's personality
  let report = `${getRandomGreeting()}\n\n`;
  report += `📅 <b>Denní report za ${dateStr}</b>\n\n`;
  
  // Performance comment
  report += `${getPerformanceComment(totalSessions, overallConversionRate)}\n\n`;
  
  report += `<b>📈 Včerejší čísla:</b>\n`;
  report += `• Konverzací: <b>${totalSessions}</b>\n`;
  report += `• Zpráv celkem: <b>${totalMessages}</b>\n`;
  report += `• Konverzí: <b>${totalConversions}</b>\n`;
  report += `• Konverzní poměr: <b>${overallConversionRate.toFixed(2)}%</b>\n\n`;

  if (Object.keys(conversionsByType).length > 0) {
    report += `<b>🎯 Co se povedlo:</b>\n`;
    const typeLabels: Record<string, string> = {
      email_capture: '📧 Získané emaily',
      whatsapp_click: '📱 WhatsApp kontakty',
      affiliate_click: '🔗 Affiliate kliky',
      purchase: '🛒 Nákupy',
      newsletter: '📰 Newsletter přihlášení',
    };
    for (const [type, count] of Object.entries(conversionsByType)) {
      const label = typeLabels[type] || type;
      report += `• ${label}: <b>${count}</b>\n`;
    }
    report += '\n';
  }

  // A/B test results
  if (stats.length > 0) {
    report += `<b>🧪 Jak si vedou moje verze:</b>\n`;
    for (const stat of stats) {
      const variant = variants.find(v => v.id === stat.variantId);
      const variantName = variant?.name || stat.variantKey;
      const sessions = Number(stat.totalSessions || 0);
      const convRate = Number(stat.conversionRate || 0).toFixed(2);
      const emoji = getVariantEmoji(stat.variantKey as string);
      
      report += `${emoji} ${variantName}: ${sessions} sessions, ${convRate}% konverze\n`;
    }

    // Find winner
    const winner = stats.reduce((best, current) => {
      const bestRate = Number(best.conversionRate || 0);
      const currentRate = Number(current.conversionRate || 0);
      return currentRate > bestRate ? current : best;
    });
    
    if (Number(winner.conversionRate || 0) > 0) {
      const winnerVariant = variants.find(v => v.id === winner.variantId);
      report += `\n🏆 Nejlepší včera: <b>${winnerVariant?.name || winner.variantKey}</b>`;
    }
  }

  report += `\n\n${getRandomClosing()}`;

  return report;
}

/**
 * Get emoji for variant
 */
function getVariantEmoji(variantKey: string): string {
  const emojis: Record<string, string> = {
    young_elegant: '✨',
    young_mystic: '👑',
    current_passion: '🔥',
    current_queen: '💜',
  };
  return emojis[variantKey] || '📊';
}

/**
 * Send daily report to Telegram
 */
export async function sendDailyReport(): Promise<boolean> {
  try {
    const report = await generateDailyReport();
    return await sendTelegramMessage(report, 'HTML');
  } catch (error) {
    console.error('[Telegram] Error generating daily report:', error);
    return false;
  }
}

/**
 * Send test message to verify Telegram configuration
 */
export async function sendTestMessage(): Promise<boolean> {
  const testMessage = `Ahoj, šéfe! 👋\n\nJsem Natálie, tvoje osobní asistentka pro Amulets.cz.\n\nVšechno funguje správně! ✅\n\nKdyby cokoliv potřeboval, jsem tu pro tebe. 💜\n\nTvoje Natálie`;
  return await sendTelegramMessage(testMessage, 'HTML');
}

/**
 * Send custom message from Natálie
 */
export async function sendCustomMessage(message: string): Promise<boolean> {
  return await sendTelegramMessage(message, 'HTML');
}

/**
 * Send alert message (for important notifications)
 */
export async function sendAlert(title: string, message: string): Promise<boolean> {
  const alertMessage = `🚨 <b>${title}</b>\n\nŠéfe, něco důležitého!\n\n${message}\n\n💜 Natálie`;
  return await sendTelegramMessage(alertMessage, 'HTML');
}

/**
 * Send success notification
 */
export async function sendSuccess(title: string, message: string): Promise<boolean> {
  const successMessage = `✅ <b>${title}</b>\n\n${message}\n\n💜 Natálie`;
  return await sendTelegramMessage(successMessage, 'HTML');
}
