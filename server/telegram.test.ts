import { describe, it, expect } from 'vitest';

describe('Telegram Integration', () => {
  it('should have TELEGRAM_BOT_TOKEN configured', () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    expect(token).toBeDefined();
    expect(token).not.toBe('');
    expect(token?.length).toBeGreaterThan(20);
  });

  it('should have TELEGRAM_CHAT_ID configured', () => {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    expect(chatId).toBeDefined();
    expect(chatId).not.toBe('');
  });

  it('should validate Telegram bot token with getMe API', async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    const url = `https://api.telegram.org/bot${token}/getMe`;
    const response = await fetch(url);
    const data = await response.json();

    expect(data.ok).toBe(true);
    expect(data.result).toBeDefined();
    expect(data.result.is_bot).toBe(true);
    expect(data.result.username).toBeDefined();
    
    console.log(`Bot validated: @${data.result.username}`);
  });
});
