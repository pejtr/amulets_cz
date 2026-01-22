/**
 * Telegram Bot Integration - Natálie, osobní asistentka
 * 
 * Natálie je vaše pravá ruka pro Amulets.cz. Posílá denní reporty,
 * sleduje výkon webu a chatbota, a je tu pro vás kdykoliv potřebujete.
 */

import { getChatbotComparisonStats, getChatbotConversionStats, getAllChatbotVariants } from './db';
import { invokeLLM } from './_core/llm';
import { generateCentralizedReport, getCachedAggregatedStats } from './centralizedReportingDb';
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

// ============================================
// HOROSCOPE & MEDITATION FEATURES
// ============================================

/**
 * Frequency data with chakra information for meditation tips
 */
const FREQUENCIES = [
  { hz: 174, name: 'Základní tón', chakra: 'Kořenová', color: '#DC2626', description: 'Uzemnění a bezpečí. Pomoc při bolesti a stresu.' },
  { hz: 285, name: 'Obnova', chakra: 'Sakální', color: '#EA580C', description: 'Regenerace buněk a tkání. Podpora hojivých procesů.' },
  { hz: 396, name: 'Osvobození', chakra: 'Solární plexus', color: '#FACC15', description: 'Osvobození od strachu a viny. Transformace negativních emocí.' },
  { hz: 417, name: 'Změna', chakra: 'Solární plexus', color: '#F59E0B', description: 'Usnadnění změny. Vyčištění traumatických zážitků.' },
  { hz: 432, name: 'Harmonie', chakra: 'Srdeční', color: '#22C55E', description: 'Univerzální ladění. Harmonie s přírodou a vesmírem.' },
  { hz: 528, name: 'Láska', chakra: 'Srdeční', color: '#10B981', description: 'Frekvence lásky a zázraků. Oprava DNA.' },
  { hz: 639, name: 'Vztahy', chakra: 'Hrdelní', color: '#06B6D4', description: 'Harmonizace vztahů. Komunikace a porozumění.' },
  { hz: 741, name: 'Intuice', chakra: 'Třetí oko', color: '#8B5CF6', description: 'Probuzení intuice. Řešení problémů.' },
  { hz: 852, name: 'Duchovnost', chakra: 'Třetí oko', color: '#A855F7', description: 'Návrat k duchovnímu řádu. Probuzení intuice.' },
  { hz: 963, name: 'Jednota', chakra: 'Korunní', color: '#EC4899', description: 'Spojení s vyšším vědomím. Osvícení.' },
];

/**
 * Generate daily Chinese horoscope message
 */
async function generateDailyHoroscope(): Promise<string> {
  const now = new Date();
  const dateStr = now.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  // Chinese zodiac animals
  const animals = ['Krysa', 'Bůvol', 'Tygr', 'Králík', 'Drak', 'Had', 'Kůň', 'Koza', 'Opice', 'Kohout', 'Pes', 'Prase'];
  const elements = ['Dřevo', 'Oheň', 'Země', 'Kov', 'Voda'];
  
  // 2026 is Year of the Fire Horse
  const yearAnimal = 'Ohnivý Kůň';
  
  // Daily energy based on day of year
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const dailyAnimal = animals[dayOfYear % 12];
  const dailyElement = elements[dayOfYear % 5];
  
  // Lucky numbers
  const luckyNumbers = [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1];
  
  // Lucky colors
  const colors = ['zlatá', 'červená', 'zelená', 'modrá', 'fialová', 'bílá', 'stříbrná'];
  const luckyColor = colors[dayOfYear % colors.length];
  
  // Recommended frequency
  const recommendedFreq = FREQUENCIES[dayOfYear % FREQUENCIES.length];
  
  let horoscope = `🌟 <b>Čínský horoskop - ${dateStr}</b>\n\n`;
  horoscope += `🐴 <b>Rok ${yearAnimal}u 2026</b>\n`;
  horoscope += `🌀 Denní energie: <b>${dailyElement} ${dailyAnimal}</b>\n\n`;
  horoscope += `🎰 Šťastná čísla: <b>${luckyNumbers.join(', ')}</b>\n`;
  horoscope += `🎨 Šťastná barva: <b>${luckyColor}</b>\n\n`;
  horoscope += `🎵 <b>Doporučená frekvence:</b>\n`;
  horoscope += `${recommendedFreq.hz} Hz - ${recommendedFreq.name}\n`;
  horoscope += `Čakra: ${recommendedFreq.chakra}\n`;
  horoscope += `${recommendedFreq.description}\n\n`;
  horoscope += `✨ Ať vás dnes provází harmonie a štěstí! 💜\n\n`;
  horoscope += `Tvoje Natálie 💜`;
  
  return horoscope;
}

/**
 * Generate meditation tips message
 */
function generateMeditationTips(): string {
  let tips = `🧘 <b>Meditační tipy podle frekvencí</b>\n\n`;
  tips += `Každá frekvence rezonuje s jinou čakrou a pomáhá s jinými aspekty života:\n\n`;
  
  for (const freq of FREQUENCIES) {
    tips += `<b>${freq.hz} Hz - ${freq.name}</b>\n`;
    tips += `• Čakra: ${freq.chakra}\n`;
    tips += `• ${freq.description}\n\n`;
  }
  
  tips += `💡 <b>Tip:</b> Použij příkaz /frekvence [Hz] pro detail konkrétní frekvence.\n`;
  tips += `Např.: /frekvence 432\n\n`;
  tips += `Tvoje Natálie 💜`;
  
  return tips;
}

/**
 * Get specific frequency tip
 */
function getFrequencyTip(hz: number): string {
  const freq = FREQUENCIES.find(f => f.hz === hz);
  
  if (!freq) {
    return `❌ Frekvence ${hz} Hz není v našem systému.\n\nDostupné frekvence: ${FREQUENCIES.map(f => f.hz).join(', ')} Hz\n\nTvoje Natálie 💜`;
  }
  
  let tip = `🎵 <b>${freq.hz} Hz - ${freq.name}</b>\n\n`;
  tip += `🟢 <b>Čakra:</b> ${freq.chakra}\n`;
  tip += `🎨 <b>Barva:</b> ${freq.color}\n\n`;
  tip += `<b>Popis:</b>\n${freq.description}\n\n`;
  
  // Add meditation instructions
  tip += `<b>🧘 Jak meditovat s touto frekvencí:</b>\n`;
  tip += `1. Najdi si klidné místo a pohodlně se usaď\n`;
  tip += `2. Zavři oči a soustřeď se na dech\n`;
  tip += `3. Představ si barvu ${freq.chakra.toLowerCase()} čakry\n`;
  tip += `4. Nech frekvenci prostávat tvým tělem\n`;
  tip += `5. Medituj 10-20 minut\n\n`;
  
  tip += `✨ Použij Generátor harmonických frekvencí na amulets.cz!\n\n`;
  tip += `Tvoje Natálie 💜`;
  
  return tip;
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
  
  // Příkaz /stats - detailní statistiky pro konkrétní platformu
  if (lowerMessage === '/stats' || lowerMessage.startsWith('/stats ')) {
    const parts = userMessage.split(' ');
    const platform = parts[1]?.toLowerCase() || 'amulets';
    
    let statsReport = '';
    if (platform === 'ohorai') {
      statsReport = await generatePlatformStats('ohorai');
    } else {
      statsReport = await generatePlatformStats('amulets');
    }
    
    await sendTelegramMessageToChat(chatId.toString(), statsReport, 'HTML');
    
    history.push({
      role: 'assistant',
      content: `[Odeslány detailní statistiky pro ${platform}]`,
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }
  
  // Příkaz /report - agregovaný report z obou webů (propojené nádoby)
  if (lowerMessage === '/report' || lowerMessage.startsWith('/report ')) {
    // Synchronizace dat před reportem
    await sendTelegramMessageToChat(chatId.toString(), '🔄 Synchronizuji data z obou platforem...', 'HTML');
    await syncBeforeReport();
    
    // Send combined daily report from both platforms
    const report = await generateCombinedDailyReport();
    await sendTelegramMessageToChat(chatId.toString(), report, 'HTML');
    
    history.push({
      role: 'assistant',
      content: '[Odeslán agregovaný report z obou webů]',
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }
  
  // Starý příkaz pro report (zpětná kompatibilita)
  if (lowerMessage.includes('report') || lowerMessage.includes('jak to jde') || lowerMessage.includes('statistiky')) {
    // Send combined daily report
    const report = await generateCombinedDailyReport();
    await sendTelegramMessageToChat(chatId.toString(), report, 'HTML');
    
    history.push({
      role: 'assistant',
      content: '[Odeslán denní report]',
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }

  // Příkaz /horoskop - denní čínský horoskop
  if (lowerMessage === '/horoskop' || lowerMessage.startsWith('/horoskop ')) {
    const horoscope = await generateDailyHoroscope();
    await sendTelegramMessageToChat(chatId.toString(), horoscope, 'HTML');
    
    history.push({
      role: 'assistant',
      content: '[Odeslán denní horoskop]',
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }

  // Příkaz /meditace - meditační tipy podle frekvencí
  if (lowerMessage === '/meditace' || lowerMessage.startsWith('/meditace ')) {
    const tips = generateMeditationTips();
    await sendTelegramMessageToChat(chatId.toString(), tips, 'HTML');
    
    history.push({
      role: 'assistant',
      content: '[Odeslány meditační tipy]',
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }

  // Příkaz /frekvence [Hz] - konkrétní frekvence
  if (lowerMessage.startsWith('/frekvence ')) {
    const hz = parseInt(lowerMessage.split(' ')[1]);
    const tip = getFrequencyTip(hz);
    await sendTelegramMessageToChat(chatId.toString(), tip, 'HTML');
    
    history.push({
      role: 'assistant',
      content: `[Odeslán tip pro frekvenci ${hz} Hz]`,
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }

  // Příkaz /premium - informace o PREMIUM členství
  if (lowerMessage === '/premium' || lowerMessage.startsWith('/premium ')) {
    const premiumMessage = generatePremiumInfoMessage();
    await sendTelegramMessageToChat(chatId.toString(), premiumMessage, 'HTML');
    
    history.push({
      role: 'assistant',
      content: '[Odeslány informace o PREMIUM členství]',
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }

  // Příkaz /status - stav členství
  if (lowerMessage === '/status' || lowerMessage.startsWith('/status ')) {
    const statusMessage = generateMembershipStatusMessage(userId.toString());
    await sendTelegramMessageToChat(chatId.toString(), statusMessage, 'HTML');
    
    history.push({
      role: 'assistant',
      content: '[Odeslán stav členství]',
      timestamp: Date.now(),
    });
    conversationHistory.set(userId, history);
    return true;
  }

  // Příkaz /vip - invite link do VIP Telegram skupiny
  if (lowerMessage === '/vip' || lowerMessage.startsWith('/vip ')) {
    const vipMessage = generateVIPInviteMessage();
    await sendTelegramMessageToChat(chatId.toString(), vipMessage, 'HTML');
    
    history.push({
      role: 'assistant',
      content: '[Odeslán invite link do VIP skupiny]',
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
  
  // Get Amulets.cz analytics (email captures, link clicks)
  const { getChatbotAnalyticsSummary } = await import('./db');
  const amuletsAnalytics = await getChatbotAnalyticsSummary(yesterday, today);
  
  // Calculate Amulets totals
  const amuletsTotalSessions = amuletsStats.reduce((sum, s) => sum + Number(s.totalSessions || 0), 0);
  const amuletsTotalMessages = amuletsStats.reduce((sum, s) => sum + Number(s.totalMessages || 0), 0);
  const amuletsTotalConversions = amuletsStats.reduce((sum, s) => sum + Number(s.totalConversions || 0), 0);
  const amuletsConversionRate = amuletsTotalSessions > 0 
    ? (amuletsTotalConversions / amuletsTotalSessions) * 100
    : 0;

  // Fetch OHORAI stats from database
  const { getOhoraiAggregatedStats, getLastSuccessfulOhoraiSync } = await import('./db');
  const ohoraiStats = await getOhoraiAggregatedStats(yesterday);
  const lastSync = await getLastSuccessfulOhoraiSync();
  
  const ohoraiTotalSessions = Number(ohoraiStats?.totalConversations || 0);
  const ohoraiTotalMessages = Number(ohoraiStats?.totalMessages || 0);
  const ohoraiTotalConversions = Number(ohoraiStats?.emailCaptures || 0) + Number(ohoraiStats?.affiliateClicks || 0);
  const ohoraiConversionRate = ohoraiTotalSessions > 0 
    ? (ohoraiTotalConversions / ohoraiTotalSessions) * 100
    : 0;
  const ohoraiHasData = ohoraiTotalSessions > 0 || lastSync !== null;

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
  report += `├─ 📧 Emailů: <b>${amuletsAnalytics?.emailsCaptured || 0}</b>\n`;
  report += `├─ 🔗 Kliknutí na odkazy: <b>${amuletsAnalytics?.linkClicks || 0}</b>\n`;
  report += `└─ Konverzní poměr: <b>${amuletsConversionRate.toFixed(2)}%</b>\n\n`;

  // OHORAI section - pouze pokud jsou data
  if (ohoraiHasData) {
    report += `💎 <b>OHORAI MARKETPLACE</b>\n`;
    report += `├─ Konverzací: <b>${ohoraiTotalSessions}</b>\n`;
    report += `├─ Zpráv: <b>${ohoraiTotalMessages}</b>\n`;
    report += `├─ Konverzí: <b>${ohoraiTotalConversions}</b>\n`;
    report += `└─ Konverzní poměr: <b>${ohoraiConversionRate.toFixed(2)}%</b>\n`;
    if (lastSync) {
      const syncTime = new Date(lastSync.syncedAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
      report += `    <i>🔄 Poslední sync: ${syncTime}</i>\n\n`;
    } else {
      report += `\n`;
    }
  }

  // Combined totals
  report += `🔮 <b>CELKEM (OBĚ PLATFORMY)</b>\n`;
  report += `├─ Konverzací: <b>${combinedSessions}</b>\n`;
  report += `├─ Zpráv: <b>${combinedMessages}</b>\n`;
  report += `├─ Konverzí: <b>${combinedConversions}</b>\n`;
  report += `└─ Konverzní poměr: <b>${combinedConversionRate.toFixed(2)}%</b>\n\n`;

  // Krátké shrnutí
  if (combinedSessions === 0) {
    report += `\n🌙 <i>Včera bylo ticho...</i>\n\n`;
  } else {
    const avgMessages = (combinedMessages / combinedSessions).toFixed(1);
    report += `\n📊 <b>Průměr:</b> ${avgMessages} zpráv/konverzace\n\n`;
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

/**
 * Generate detailed platform-specific stats
 * Použití: /stats amulets nebo /stats ohorai
 */
export async function generatePlatformStats(platform: 'amulets' | 'ohorai'): Promise<string> {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Format date
  const dateStr = yesterday.toLocaleDateString('cs-CZ', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let report = `${getRandomGreeting()}\n\n`;
  
  if (platform === 'amulets') {
    // Get Amulets.cz detailed stats
    const stats = await getChatbotComparisonStats(yesterday, today);
    const conversionStats = await getChatbotConversionStats(yesterday, today);
    const variants = await getAllChatbotVariants();

    const totalSessions = stats.reduce((sum, s) => sum + Number(s.totalSessions || 0), 0);
    const totalMessages = stats.reduce((sum, s) => sum + Number(s.totalMessages || 0), 0);
    const totalConversions = stats.reduce((sum, s) => sum + Number(s.totalConversions || 0), 0);
    const conversionRate = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

    report += `💜 <b>AMULETS.CZ - DETAILNÍ STATISTIKY</b>\n`;
    report += `📅 ${dateStr}\n\n`;
    
    report += `<b>📊 Základní metriky:</b>\n`;
    report += `├─ Konverzací: <b>${totalSessions}</b>\n`;
    report += `├─ Zpráv celkem: <b>${totalMessages}</b>\n`;
    report += `├─ Konverzí: <b>${totalConversions}</b>\n`;
    report += `└─ Konverzní poměr: <b>${conversionRate.toFixed(2)}%</b>\n\n`;

    // Conversion breakdown
    if (conversionStats.length > 0) {
      report += `<b>🎯 Konverze podle typu:</b>\n`;
      const typeLabels: Record<string, string> = {
        email_capture: '📧 Emaily',
        whatsapp_click: '📱 WhatsApp',
        affiliate_click: '🔗 Affiliate',
        purchase: '🛒 Nákupy',
        newsletter: '📰 Newsletter',
      };
      for (const conv of conversionStats) {
        const label = typeLabels[conv.conversionType as string] || conv.conversionType;
        report += `├─ ${label}: <b>${conv.totalConversions}</b>\n`;
      }
      report += `\n`;
    }

    // A/B test variants
    if (stats.length > 0) {
      report += `<b>🧪 A/B Test varianty:</b>\n`;
      for (const stat of stats) {
        const variant = variants.find(v => v.id === stat.variantId);
        const variantName = variant?.name || stat.variantKey;
        const sessions = Number(stat.totalSessions || 0);
        const convRate = Number(stat.conversionRate || 0).toFixed(2);
        report += `├─ ${variantName}: ${sessions} sessions, ${convRate}% konverze\n`;
      }
    }

  } else {
    // OHORAI stats (placeholder - bude naplněno po synchronizaci)
    report += `💎 <b>OHORAI - DETAILNÍ STATISTIKY</b>\n`;
    report += `📅 ${dateStr}\n\n`;
    report += `<i>Čekám na synchronizaci dat z OHORAI...</i>\n\n`;
    report += `Pro aktivaci synchronizace implementuj hodinový sync v OHORAI projektu.\n`;
  }

  report += `\n${getRandomClosing()}`;
  return report;
}

// ============================================
// AUTOMATICKÝ DENNÍ REPORT V 8:00
// ============================================

// ============================================
// SYNCHRONIZACE PŘED REPORTEM
// ============================================

/**
 * Synchronizace dat před generováním reportu
 * Volá se před každým /report příkazem
 */
async function syncBeforeReport(): Promise<void> {
  console.log('[Telegram] Synchronizing data before report...');
  
  try {
    // 1. Aktualizovat lokální statistiky z databáze
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    // Získat aktuální statistiky z Amulets.cz
    const amuletsStats = await getChatbotComparisonStats(today, now);
    console.log(`[Telegram] Amulets.cz stats: ${amuletsStats.length} variants`);
    
    // 2. Pokusit se získat data z OHORAI (pokud je dostupné)
    // TODO: Implementovat po nastavení OHORAI synchronizace
    // const ohoraiStats = await fetchOhoraiStats();
    
    // 3. Cache výsledky pro rychlý přístup
    lastSyncTime = Date.now();
    
    console.log('[Telegram] Sync completed successfully');
  } catch (error) {
    console.error('[Telegram] Sync error:', error);
    // Pokračovat i při chybě - použijeme poslední známá data
  }
}

// Cache pro poslední synchronizaci
let lastSyncTime = 0;

let dailyReportScheduled = false;

/**
 * Schedule automatic daily report at 8:00 AM CET
 */
export function scheduleDailyReport(): void {
  if (dailyReportScheduled) return;
  dailyReportScheduled = true;
  
  const checkAndSendMessages = async () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Send daily report at 8:00 AM (with 5 minute window)
    if (hours === 8 && minutes >= 0 && minutes < 5) {
      console.log('[Telegram] Sending scheduled daily report...');
      await sendCombinedDailyReport();
    }
    
    // Send meditation reminder at 19:45 (with 5 minute window)
    if (hours === 19 && minutes >= 45 && minutes < 50) {
      const vipGroupChatId = process.env.TELEGRAM_VIP_GROUP_CHAT_ID;
      if (vipGroupChatId) {
        console.log('[Telegram] Sending meditation reminder to VIP group...');
        const reminder = generateMeditationReminder();
        await sendTelegramMessageToChat(vipGroupChatId, reminder, 'HTML');
      }
    }
  };
  
  // Check every 5 minutes
  setInterval(checkAndSendMessages, 5 * 60 * 1000);
  
  console.log('[Telegram] Daily report scheduled for 8:00 AM');
  console.log('[Telegram] Meditation reminder scheduled for 19:45');
}

/**
 * Generate VIP invite message with link to Telegram VIP group
 */
function generateVIPInviteMessage(): string {
  const vipGroupLink = process.env.TELEGRAM_VIP_GROUP_LINK || 'https://t.me/+YOUR_INVITE_LINK';
  
  let message = `🪷 <b>VÍTEJ V AMULETS VIP KOMUNITĚ!</b> 🪷\n\n`;
  message += `Ahoj krásná duše! 💜\n\n`;
  message += `Jsem Natálie a jsem tak ráda, že tě tady mám! Tato komunita je <b>bezpečný prostor</b> pro ženy, které chtějí žít v harmonii se svým tělem, cyklem a duší.\n\n`;
  
  message += `✨ <b>CO TĚ TADY ČEKÁ:</b>\n\n`;
  message += `🧘 Denní meditace - Řízené meditace s Solfeggio frekvencemi\n`;
  message += `🔮 Spirítuální tipy - Symboly, rituály, měsíční cykly\n`;
  message += `💬 Podpůrná komunita - Ženy, které tě chápou\n`;
  message += `🎁 Exkluzivní obsah - Jen pro členy této skupiny\n`;
  message += `👑 VIP přístup - Pro Premium členy (88 Kč/měsíc)\n\n`;
  
  message += `🎁 <b>DÁREK PRO TEBE:</b>\n\n`;
  message += `Jako vítání dostáváš <b>ZDARMA eBook "Tvůj Cyklus, Tvá Síla"</b> (hodnota 888 Kč)!\n\n`;
  
  message += `👉 <b>PŘIPOJ SE TADY:</b>\n`;
  message += `<a href="${vipGroupLink}">🪷 Amulets VIP Skupina</a>\n\n`;
  
  message += `Těším se na tebe! 🪷✨\n\n`;
  message += `<i>Natálie Ohorai</i>\n`;
  message += `<i>Průvodkyně spirítuální harmonií</i>`;
  
  return message;
}

/**
 * Generate welcome message for new VIP group members
 */
export function generateVIPWelcomeMessage(firstName: string = 'krásná duše'): string {
  let message = `🪷 <b>VÍTEJ V AMULETS VIP KOMUNITĚ!</b> 🪷\n\n`;
  message += `Ahoj ${firstName}! 💜\n\n`;
  message += `Jsem Natálie a jsem tak ráda, že jsi tady! Tato komunita je <b>bezpečný prostor</b> pro ženy, které chtějí žít v harmonii se svým tělem, cyklem a duší.\n\n`;
  
  message += `✨ <b>CO TĚ TADY ČEKÁ:</b>\n\n`;
  message += `🧘 <b>Denní meditace</b> - Řízené meditace s Solfeggio frekvencemi\n`;
  message += `🔮 <b>Spirítuální tipy</b> - Symboly, rituály, měsíční cykly\n`;
  message += `💬 <b>Podpůrná komunita</b> - Ženy, které tě chápou\n`;
  message += `🎁 <b>Exkluzivní obsah</b> - Jen pro členy této skupiny\n`;
  message += `👑 <b>VIP přístup</b> - Pro Premium členy (88 Kč/měsíc)\n\n`;
  
  message += `📋 <b>PRVNÍ KROKY:</b>\n\n`;
  message += `1️⃣ Přečti si pravidla (📌 připinutá zpráva)\n`;
  message += `2️⃣ Představ se v #hlavní-chat (kdo jsi, co tě přivedlo)\n`;
  message += `3️⃣ Prozkoumej kanály (📢 #oznámení, 🧘 #meditace-frekvence, 🔮 #symboly-rituály)\n`;
  message += `4️⃣ Připoj se k dnešní meditaci (každý den v 20:00)\n\n`;
  
  message += `🎁 <b>DÁREK PRO TEBE:</b>\n\n`;
  message += `Jako vítání dostáváš <b>ZDARMA eBook "Tvůj Cyklus, Tvá Síla"</b> (hodnota 888 Kč)!\n\n`;
  message += `👉 Stáhni zde: <a href="https://amulets.cz/ebook-cyklus">eBook ZDARMA</a>\n\n`;
  
  message += `---\n\n`;
  message += `Máš otázku? Napiš @NatalieOhorai nebo adminům.\n\n`;
  message += `Těším se na tebe! 🪷✨\n\n`;
  message += `<i>Natálie Ohorai</i>\n`;
  message += `<i>Průvodkyně spirítuální harmonií</i>`;
  
  return message;
}

/**
 * Generate daily meditation reminder (19:45)
 */
export function generateMeditationReminder(): string {
  const frequencies = [
    { hz: 396, name: 'Ukotvení', chakra: 'Root' },
    { hz: 417, name: 'Změna', chakra: 'Sacral' },
    { hz: 528, name: 'Láska', chakra: 'Heart' },
    { hz: 639, name: 'Harmonie', chakra: 'Heart' },
    { hz: 741, name: 'Intuice', chakra: 'Throat' },
    { hz: 852, name: 'Probuzení', chakra: 'Third Eye' },
    { hz: 963, name: 'Spojení', chakra: 'Crown' },
  ];
  
  // Random frequency for today
  const today = frequencies[new Date().getDay() % frequencies.length];
  
  let message = `🧘 <b>DENNÍ MEDITACE ZA 15 MINUT!</b> 🧘\n\n`;
  message += `Dobrý večer, krásné duše! 💜\n\n`;
  message += `Dnes meditujeme s frekvencí <b>${today.hz} Hz</b> (${today.name}).\n\n`;
  message += `🎵 <b>FREKVENCE:</b> ${today.hz} Hz (${today.chakra} Chakra)\n`;
  message += `⏱️ <b>DÉLKA:</b> 10-15 minut\n`;
  message += `🎯 <b>CÍL:</b> ${today.name}\n\n`;
  message += `👉 Připoj se v 20:00 v #meditace-frekvence!\n\n`;
  message += `Jsi připravená? ✨\n\n`;
  message += `<i>Natálie</i> 🪷`;
  
  return message;
}

/**
 * Generate PREMIUM membership info message
 */
function generatePremiumInfoMessage(): string {
  const premiumGroupLink = process.env.TELEGRAM_PREMIUM_GROUP_LINK || 'https://t.me/+YOUR_PREMIUM_LINK';
  
  let message = `💎 <b>AMULETS PREMIUM ČLENSTVÍ</b> 💎\n\n`;
  message += `Ahoj krásná duše! 💜\n\n`;
  message += `PREMIUM členství ti otevře dveře do exkluzivního světa spirituality, harmonie a seberozvoje.\n\n`;
  
  message += `✨ <b>CO ZÍSKÁŠ:</b>\n\n`;
  message += `🧘 <b>Exkluzivní meditace</b> - 4 nové meditace měsíčně (audio)\n`;
  message += `🎙️ <b>Live Q&A s Natálií</b> - 1× měsíčně, 60 minut\n`;
  message += `🎁 <b>Early access</b> - Nové produkty 7 dní před ostatními\n`;
  message += `💰 <b>Slevy 15%</b> - Na všechny produkty OHORAI\n`;
  message += `📚 <b>Měsíční eBook</b> - Digitální produkt zdarma\n`;
  message += `👑 <b>VIP komunita</b> - Přístup do #vip-lounge\n\n`;
  
  message += `💵 <b>CENA:</b>\n\n`;
  message += `👉 <b>88 Kč/měsíc</b> (hodnota 1144 Kč!)\n`;
  message += `👉 První týden ZDARMA\n`;
  message += `👉 30denní záruka vrácení peněz\n\n`;
  
  message += `🌟 <b>BONUS PŘI REGISTRACI:</b>\n\n`;
  message += `🎁 eBook "Tvůj Cyklus, Tvá Síla" (hodnota 888 Kč)\n`;
  message += `🎁 Přístup do OHORAI Marketplace se slevou 15%\n\n`;
  
  message += `👉 <b>REGISTRACE:</b>\n`;
  message += `<a href="https://amulets.cz/premium">Staň se PREMIUM členem</a>\n\n`;
  
  message += `<i>Máš otázky? Napiš mi!</i> 💜\n\n`;
  message += `<i>Natálie Ohorai</i>\n`;
  message += `<i>Průvodkyně spirítuální harmonií</i>`;
  
  return message;
}

/**
 * Generate membership status message
 */
function generateMembershipStatusMessage(userId: string): string {
  // TODO: Fetch actual membership status from database
  // For now, return a placeholder message
  
  let message = `📋 <b>STAV TVÉHO ČLENSTVÍ</b> 📋\n\n`;
  message += `Ahoj! Tady je přehled tvého členství:\n\n`;
  
  message += `👤 <b>Uživatel:</b> ${userId}\n`;
  message += `🌟 <b>Tier:</b> FREE\n`;
  message += `📅 <b>Od:</b> -\n`;
  message += `⏳ <b>Platí do:</b> -\n\n`;
  
  message += `💎 <b>UPGRADE NA PREMIUM:</b>\n\n`;
  message += `Za pouhých 88 Kč/měsíc získáš:\n`;
  message += `• Exkluzivní meditace\n`;
  message += `• Live Q&A s Natálií\n`;
  message += `• 15% slevy na OHORAI\n`;
  message += `• Měsíční eBooky\n\n`;
  
  message += `👉 Napiš /premium pro více info!\n\n`;
  
  message += `<i>Natálie</i> 🪷`;
  
  return message;
}

// Auto-start scheduler when module loads
scheduleDailyReport();
