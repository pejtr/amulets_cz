/**
 * Telegram Bot Integration for Daily Reports
 * 
 * This module provides functionality to send daily chatbot statistics
 * to a Telegram chat using the Telegram Bot API.
 */

import { getChatbotComparisonStats, getChatbotConversionStats, getAllChatbotVariants } from './db';

// Telegram Bot Configuration
// Bot token and chat ID should be stored in environment variables
// Use functions to get values dynamically (after server restart)
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
 * Generate daily chatbot report
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
    ? ((totalConversions / totalSessions) * 100).toFixed(2) 
    : '0.00';

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

  // Build report message
  let report = `📊 <b>Denní report chatbota Natálie</b>\n`;
  report += `📅 ${dateStr}\n\n`;
  
  report += `<b>📈 Celkové statistiky:</b>\n`;
  report += `• Sessions: <b>${totalSessions}</b>\n`;
  report += `• Zprávy: <b>${totalMessages}</b>\n`;
  report += `• Konverze: <b>${totalConversions}</b>\n`;
  report += `• Konverzní poměr: <b>${overallConversionRate}%</b>\n\n`;

  if (Object.keys(conversionsByType).length > 0) {
    report += `<b>🎯 Konverze podle typu:</b>\n`;
    const typeLabels: Record<string, string> = {
      email_capture: '📧 Email',
      whatsapp_click: '📱 WhatsApp',
      affiliate_click: '🔗 Affiliate',
      purchase: '🛒 Nákup',
      newsletter: '📰 Newsletter',
    };
    for (const [type, count] of Object.entries(conversionsByType)) {
      const label = typeLabels[type] || type;
      report += `• ${label}: <b>${count}</b>\n`;
    }
    report += '\n';
  }

  report += `<b>🧪 A/B test varianty:</b>\n`;
  for (const stat of stats) {
    const variant = variants.find(v => v.id === stat.variantId);
    const variantName = variant?.name || stat.variantKey;
    const sessions = Number(stat.totalSessions || 0);
    const convRate = Number(stat.conversionRate || 0).toFixed(2);
    const emoji = getVariantEmoji(stat.variantKey as string);
    
    report += `${emoji} <b>${variantName}</b>\n`;
    report += `   Sessions: ${sessions} | Konverze: ${convRate}%\n`;
  }

  // Find winner
  if (stats.length > 0) {
    const winner = stats.reduce((best, current) => {
      const bestRate = Number(best.conversionRate || 0);
      const currentRate = Number(current.conversionRate || 0);
      return currentRate > bestRate ? current : best;
    });
    
    if (Number(winner.conversionRate || 0) > 0) {
      const winnerVariant = variants.find(v => v.id === winner.variantId);
      report += `\n🏆 <b>Nejlepší varianta:</b> ${winnerVariant?.name || winner.variantKey}`;
    }
  }

  report += `\n\n💜 Amulets.cz`;

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
  const testMessage = `🔔 <b>Test zprávy z Amulets.cz</b>\n\nTelegram integrace funguje správně! 🎉\n\n💜 Natálie`;
  return await sendTelegramMessage(testMessage, 'HTML');
}
