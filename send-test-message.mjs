import 'dotenv/config';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!botToken || !chatId) {
  console.error('❌ TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not found');
  process.exit(1);
}

console.log('📤 Sending test message to Telegram bot...');
console.log('Chat ID:', chatId);

const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '✅ Test zpráva z Amulets.cz webu!\n\nBot funguje správně a je připraven odpovídat na vaše zprávy. 💜',
      parse_mode: 'HTML',
    }),
  });

  const data = await response.json();
  
  if (data.ok) {
    console.log('✅ Test message sent successfully!');
    console.log('Message ID:', data.result.message_id);
  } else {
    console.error('❌ Failed to send message');
    console.error('Response:', JSON.stringify(data, null, 2));
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
