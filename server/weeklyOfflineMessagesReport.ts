import { getAllOfflineMessages } from './db';
import { sendBrevoEmail } from './brevo';

/**
 * Generuje HTML email s přehledem nepřečtených offline zpráv
 */
export async function generateWeeklyOfflineMessagesReport(): Promise<string> {
  // Získat všechny nepřečtené zprávy
  const unreadMessages = await getAllOfflineMessages({ 
    unreadOnly: true,
    limit: 1000,
    offset: 0 
  });

  if (unreadMessages.length === 0) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Týdenní report offline zpráv</h1>
            <p>${new Date().toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="content">
            <p style="font-size: 18px; color: #28a745;">✅ <strong>Skvělá práce!</strong></p>
            <p>Nemáte žádné nepřečtené offline zprávy z chatbota.</p>
          </div>
          <div class="footer">
            <p>Tento report je generován automaticky každé pondělí v 8:00.</p>
            <p><a href="https://amulets.manus.space/admin/messages">Přejít do administrace zpráv</a></p>
          </div>
        </body>
      </html>
    `;
  }

  // Seskupit zprávy podle data (nejnovější první)
  const messagesByDate = unreadMessages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('cs-CZ');
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, typeof unreadMessages>);

  // Generovat HTML pro jednotlivé zprávy
  const messagesHtml = Object.entries(messagesByDate)
    .map(([date, messages]) => `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          📅 ${date} (${messages.length} ${messages.length === 1 ? 'zpráva' : messages.length < 5 ? 'zprávy' : 'zpráv'})
        </h3>
        ${messages.map(msg => {
          const browsingContext = msg.browsingContext as any;
          const currentPage = browsingContext?.currentPage || 'N/A';
          
          return `
            <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #764ba2; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong style="color: #667eea;">📧 ${msg.email || 'Email neuvedeno'}</strong>
                <span style="color: #999; font-size: 14px;">${new Date(msg.createdAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p style="margin: 10px 0; white-space: pre-wrap;">${msg.message}</p>
              <div style="font-size: 14px; color: #666; margin-top: 10px;">
                <span>📄 Stránka: ${currentPage}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-box { background: white; padding: 20px; border-radius: 8px; text-align: center; flex: 1; margin: 0 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .stat-number { font-size: 36px; font-weight: bold; color: #667eea; }
          .stat-label { color: #666; margin-top: 5px; }
          .content { margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; background: white; border-radius: 10px; color: #666; font-size: 14px; }
          .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Týdenní report offline zpráv</h1>
          <p>${new Date().toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div class="stats">
          <div class="stat-box">
            <div class="stat-number">${unreadMessages.length}</div>
            <div class="stat-label">Nepřečtených zpráv</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${Object.keys(messagesByDate).length}</div>
            <div class="stat-label">Dnů s aktivitou</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${unreadMessages.filter(m => m.email).length}</div>
            <div class="stat-label">Zpráv s emailem</div>
          </div>
        </div>

        <div class="content">
          ${messagesHtml}
        </div>

        <div class="footer">
          <p><strong>Co dělat dál?</strong></p>
          <p>Odpovězte na tyto zprávy co nejdříve, abyste neztratili potenciální zákazníky.</p>
          <a href="https://amulets.manus.space/admin/messages" class="cta-button">Přejít do administrace zpráv</a>
          <p style="margin-top: 20px; font-size: 12px;">Tento report je generován automaticky každé pondělí v 8:00.</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Odešle týdenní report emailem vlastníkovi projektu
 */
export async function sendWeeklyOfflineMessagesReport(): Promise<{ success: boolean; message: string }> {
  try {
    const htmlContent = await generateWeeklyOfflineMessagesReport();
    
    // Získat počet nepřečtených zpráv pro subject
    const unreadMessages = await getAllOfflineMessages({ 
      unreadOnly: true,
      limit: 1000,
      offset: 0 
    });

    const subject = unreadMessages.length === 0 
      ? '✅ Týdenní report: Žádné nepřečtené zprávy'
      : `📊 Týdenní report: ${unreadMessages.length} nepřečtených zpráv`;

    // Odeslat email vlastníkovi
    const ownerEmail = process.env.OWNER_EMAIL || 'petr.vavra@gmail.com'; // Fallback na výchozí email
    
    await sendBrevoEmail({
      to: [{ email: ownerEmail, name: 'Admin' }],
      subject,
      htmlContent: htmlContent,
      sender: { name: 'Amulets.cz', email: 'info@amulets.cz' },
    });

    return {
      success: true,
      message: `Týdenní report odeslán na ${ownerEmail}. Počet nepřečtených zpráv: ${unreadMessages.length}`,
    };
  } catch (error) {
    console.error('Failed to send weekly offline messages report:', error);
    return {
      success: false,
      message: `Chyba při odesílání reportu: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
