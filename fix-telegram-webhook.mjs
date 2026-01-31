import 'dotenv/config';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webhookUrl = 'https://3000-i99lfbwjx8s4q4b5wqy16-5fe8a380.us1.manus.computer/api/telegram/webhook';

if (!botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in environment');
  process.exit(1);
}

console.log('🔧 Setting Telegram webhook...');
console.log('Webhook URL:', webhookUrl);

const url = `https://api.telegram.org/bot${botToken}/setWebhook`;

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message'],
    }),
  });

  const data = await response.json();
  
  if (data.ok) {
    console.log('✅ Webhook set successfully!');
    console.log('Response:', JSON.stringify(data, null, 2));
  } else {
    console.error('❌ Failed to set webhook');
    console.error('Response:', JSON.stringify(data, null, 2));
    process.exit(1);
  }

  // Get webhook info to verify
  console.log('\n🔍 Verifying webhook info...');
  const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
  const infoData = await infoResponse.json();
  console.log('Webhook info:', JSON.stringify(infoData.result, null, 2));

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
