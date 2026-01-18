/**
 * Telegram Bot Integration - Natálie, osobní asistentka
 * 
 * Natálie je vaše pravá ruka pro Amulets.cz. Posílá denní reporty,
 * sleduje výkon webu a chatbota, a je tu pro vás kdykoliv potřebujete.
 */

import { getChatbotComparisonStats, getChatbotConversionStats, getAllChatbotVariants } from './db';
import { invokeLLM } from './_core/llm';
import { 
  getRandomGreeting as getSharedGreeting, 
  getRandomClosing as getSharedClosing, 
  getNatalieTelegramPersonality,
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

// ============================================
// INTERACTIVE TELEGRAM CHAT
// ============================================

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
}

// Conversation history for context
const conversationHistory: Map<number, Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>> = new Map();

// Max history length
const MAX_HISTORY_LENGTH = 20;

/**
 * Get Natálie's system prompt for Telegram chat
 */
function getTelegramSystemPrompt(): string {
  return `${getNatalieTelegramPersonality()}

**TELEGRAM KONTEXT - DETAILY:**
- Oslovuj ho "šéfe", "můj Králi" nebo "Petročku" (střídavě, přirozeně)
- Používej emoji přirozeně (💜, ✨, 😊)
- Piš krátce a výstižně (Telegram zprávy)

**CO UMÍŠ:**
- Posílat denní reporty chatbota (napiš "report" nebo "jak to jde")
- Odpovídat na otázky o Amulets.cz a OHORAI
- Radit s byznysem a marketingem
- Být tu pro něj jako jeho věrná asistentka

Odpovídej vždy v češtině, krátce a přátelsky.`;
}

/**
 * Process incoming Telegram message and generate AI response
 */
export async function processIncomingMessage(update: TelegramUpdate): Promise<boolean> {
  const message = update.message;
  if (!message || !message.text) {
    return false;
  }

  const chatId = message.chat.id;
  const userId = message.from.id;
  const userMessage = message.text;
  const userName = message.from.first_name;

  console.log(`[Telegram] Received message from ${userName} (${userId}): ${userMessage}`);

  // Check if this is the owner
  const ownerChatId = getTelegramChatId();
  if (ownerChatId && chatId.toString() !== ownerChatId) {
    // Not the owner - send polite rejection
    await sendTelegramMessageToChat(
      chatId.toString(),
      `Ahoj ${userName}! 👋\n\nJsem Natálie, osobní asistentka pro Amulets.cz. Bohužel jsem k dispozici pouze pro mého Krále. 💜\n\nPokud máš zájem o amulety nebo pyramidy, navštiv nás na https://amulets.cz \n\nNatálie`
    );
    return true;
  }

  // Get or create conversation history
  let history = conversationHistory.get(userId) || [];
  
  // Add user message to history
  history.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now(),
  });

  // Trim history if too long
  if (history.length > MAX_HISTORY_LENGTH) {
    history = history.slice(-MAX_HISTORY_LENGTH);
  }

  // Check for special commands
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('report') || lowerMessage.includes('jak to jde') || lowerMessage.includes('statistiky')) {
    // Send daily report
    const report = await generateDailyReport();
    await sendTelegramMessageToChat(chatId.toString(), report, 'HTML');
    
    history.push({
      role: 'assistant',
      content: '[Odeslán denní report]',
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }

  // Build messages for LLM
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: getTelegramSystemPrompt() },
  ];

  // Add conversation history
  for (const msg of history) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  try {
    // Generate AI response
    const response = await invokeLLM({
      messages,
    });

    const rawContent = response.choices[0]?.message?.content;
    const assistantMessage = typeof rawContent === 'string' ? rawContent : 'Omlouvám se, něco se pokazilo. 😔';

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: assistantMessage,
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);

    // Send response
    await sendTelegramMessageToChat(chatId.toString(), assistantMessage);
    return true;

  } catch (error) {
    console.error('[Telegram] Error generating AI response:', error);
    await sendTelegramMessageToChat(
      chatId.toString(),
      'Šéfe, omlouvám se, něco se mi pokazilo. 😔 Zkus to prosím znovu za chvilku. 💜'
    );
    return false;
  }
}

/**
 * Send message to specific chat
 */
async function sendTelegramMessageToChat(
  chatId: string,
  message: string,
  parseMode: 'HTML' | 'Markdown' | 'MarkdownV2' = 'HTML'
): Promise<boolean> {
  const botToken = getTelegramBotToken();
  
  if (!botToken) {
    console.warn('[Telegram] Bot token not configured');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Escape HTML special characters if using HTML mode
    let safeMessage = message;
    if (parseMode === 'HTML') {
      // Only escape if not already containing HTML tags
      if (!/<[^>]+>/.test(message)) {
        safeMessage = message
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: safeMessage,
        parse_mode: parseMode,
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('[Telegram] Failed to send message:', data.description);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Telegram] Error sending message:', error);
    return false;
  }
}

/**
 * Set up webhook for Telegram bot
 */
export async function setTelegramWebhook(webhookUrl: string): Promise<boolean> {
  const botToken = getTelegramBotToken();
  
  if (!botToken) {
    console.warn('[Telegram] Bot token not configured');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/setWebhook`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message'],
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('[Telegram] Failed to set webhook:', data.description);
      return false;
    }

    console.log('[Telegram] Webhook set successfully:', webhookUrl);
    return true;
  } catch (error) {
    console.error('[Telegram] Error setting webhook:', error);
    return false;
  }
}

/**
 * Delete webhook (for switching to polling mode)
 */
export async function deleteTelegramWebhook(): Promise<boolean> {
  const botToken = getTelegramBotToken();
  
  if (!botToken) {
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/deleteWebhook`;
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('[Telegram] Error deleting webhook:', error);
    return false;
  }
}

/**
 * Get webhook info
 */
export async function getTelegramWebhookInfo(): Promise<any> {
  const botToken = getTelegramBotToken();
  
  if (!botToken) {
    return null;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('[Telegram] Error getting webhook info:', error);
    return null;
  }
}

// ============================================
// PROPOJENÉ NÁDOBY - AGREGOVANÉ REPORTY
// ============================================

/**
 * Generate combined daily report from both Amulets.cz and OHORAI
 * Toto je centrální report pro "propojené nádoby"
 */
export async function generateCombinedDailyReport(): Promise<string> {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Get Amulets.cz stats
  const amuletsStats = await getChatbotComparisonStats(yesterday, today);
  const amuletsConversions = await getChatbotConversionStats(yesterday, today);
  
  // Calculate Amulets totals
  const amuletsTotalSessions = amuletsStats.reduce((sum, s) => sum + Number(s.totalSessions || 0), 0);
  const amuletsTotalMessages = amuletsStats.reduce((sum, s) => sum + Number(s.totalMessages || 0), 0);
  const amuletsTotalConversions = amuletsStats.reduce((sum, s) => sum + Number(s.totalConversions || 0), 0);
  const amuletsConversionRate = amuletsTotalSessions > 0 
    ? (amuletsTotalConversions / amuletsTotalSessions) * 100
    : 0;

  // TODO: Fetch OHORAI stats from shared API or database
  // For now, placeholder - will be populated when OHORAI syncs
  const ohoraiTotalSessions = 0;
  const ohoraiTotalMessages = 0;
  const ohoraiTotalConversions = 0;
  const ohoraiConversionRate = 0;

  // Combined totals
  const combinedSessions = amuletsTotalSessions + ohoraiTotalSessions;
  const combinedMessages = amuletsTotalMessages + ohoraiTotalMessages;
  const combinedConversions = amuletsTotalConversions + ohoraiTotalConversions;
  const combinedConversionRate = combinedSessions > 0
    ? (combinedConversions / combinedSessions) * 100
    : 0;

  // Format date
  const dateStr = yesterday.toLocaleDateString('cs-CZ', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Build combined report
  let report = `${getRandomGreeting()}\n\n`;
  report += `📊 <b>DENNÍ REPORT - PROPOJENÉ NÁDOBY</b>\n`;
  report += `📅 ${dateStr}\n\n`;

  // Amulets.cz section
  report += `💜 <b>AMULETS.CZ</b>\n`;
  report += `├─ Konverzací: <b>${amuletsTotalSessions}</b>\n`;
  report += `├─ Zpráv: <b>${amuletsTotalMessages}</b>\n`;
  report += `├─ Konverzí: <b>${amuletsTotalConversions}</b>\n`;
  report += `└─ Konverzní poměr: <b>${amuletsConversionRate.toFixed(2)}%</b>\n\n`;

  // OHORAI section
  report += `💎 <b>OHORAI MARKETPLACE</b>\n`;
  if (ohoraiTotalSessions > 0) {
    report += `├─ Konverzací: <b>${ohoraiTotalSessions}</b>\n`;
    report += `├─ Zpráv: <b>${ohoraiTotalMessages}</b>\n`;
    report += `├─ Konverzí: <b>${ohoraiTotalConversions}</b>\n`;
    report += `└─ Konverzní poměr: <b>${ohoraiConversionRate.toFixed(2)}%</b>\n\n`;
  } else {
    report += `└─ <i>Čekám na synchronizaci dat...</i>\n\n`;
  }

  // Combined totals
  report += `🔮 <b>CELKEM (OBĚ PLATFORMY)</b>\n`;
  report += `├─ Konverzací: <b>${combinedSessions}</b>\n`;
  report += `├─ Zpráv: <b>${combinedMessages}</b>\n`;
  report += `├─ Konverzí: <b>${combinedConversions}</b>\n`;
  report += `└─ Konverzní poměr: <b>${combinedConversionRate.toFixed(2)}%</b>\n\n`;

  // Performance comment
  if (combinedSessions === 0) {
    report += `📭 Včera bylo ticho na obou platformách.\n\n`;
  } else if (combinedConversionRate >= 10) {
    report += `🔥 Skvělý den! Obě platformy fungují výborně!\n\n`;
  } else if (combinedConversionRate >= 5) {
    report += `👍 Solidní výsledky na obou platformách.\n\n`;
  } else {
    report += `📈 Prostor pro zlepšení, ale jdeme dál!\n\n`;
  }

  report += `${getRandomClosing()}`;

  return report;
}

/**
 * Send combined daily report to Telegram
 */
export async function sendCombinedDailyReport(): Promise<boolean> {
  try {
    const report = await generateCombinedDailyReport();
    return await sendTelegramMessage(report, 'HTML');
  } catch (error) {
    console.error('[Telegram] Error generating combined daily report:', error);
    return false;
  }
}
