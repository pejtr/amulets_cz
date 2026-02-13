const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function sendEbookEmail(email: string, name: string, ebookType: string) {
  if (!BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured, skipping email send');
    return;
  }

  const ebookTitles: Record<string, string> = {
    "7-kroku-k-rovnovaze": "7 Kroků k Rovnováze",
  };

  const title = ebookTitles[ebookType] || ebookType;
  const downloadUrl = `${process.env.VITE_APP_URL || 'https://amulets.manus.space'}/${ebookType}.pdf`;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'Natálie z Amulets.cz',
        email: 'info@amulets.cz',
      },
      to: [
        {
          email,
          name,
        },
      ],
      subject: `📖 Váš e-book "${title}" je připraven ke stažení`,
      htmlContent: `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%); border-radius: 8px 8px 0 0;">
              <img src="https://amulets.manus.space/logo.png" alt="Amulets.cz" style="height: 60px; margin-bottom: 20px;" />
              <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: 600;">
                Děkujeme, ${name}!
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Váš e-book <strong>"${title}"</strong> je připraven ke stažení. Klikněte na tlačítko níže a začněte svou cestu k rovnováze ještě dnes.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${downloadUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      📥 Stáhnout e-book
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                <strong>Co dál?</strong>
              </p>
              
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                <li style="margin-bottom: 10px;">
                  <strong>Prozkoumejte naše posvátné symboly</strong> - Najděte svůj osobní talisman v našem 
                  <a href="https://amulets.manus.space/pruvod" style="color: #9333ea; text-decoration: none;">průvodci</a>
                </li>
                <li style="margin-bottom: 10px;">
                  <strong>Vyzkoušejte náš kvíz</strong> - Zjistěte, který spirituální symbol je pro vás 
                  <a href="https://amulets.manus.space/kviz" style="color: #9333ea; text-decoration: none;">začít kvíz</a>
                </li>
                <li style="margin-bottom: 10px;">
                  <strong>Osobní koučink s Natálií</strong> - Hlubší podpora na vaší cestě 
                  <a href="https://amulets.manus.space/o-nas" style="color: #9333ea; text-decoration: none;">zjistit více</a>
                </li>
              </ul>
              
              <div style="margin-top: 30px; padding: 20px; background-color: #faf5ff; border-left: 4px solid #9333ea; border-radius: 4px;">
                <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6; font-style: italic;">
                  "Rovnováha není cíl, ale cesta, kterou můžeme aktivně utvářet každý den."
                </p>
                <p style="margin: 10px 0 0; color: #6b7280; font-size: 13px;">
                  — Natálie Ohorai
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                S láskou a světlem,<br />
                <strong>Natálie a tým Amulets.cz</strong>
              </p>
              
              <div style="margin: 20px 0;">
                <a href="https://amulets.manus.space" style="color: #9333ea; text-decoration: none; margin: 0 10px;">Web</a>
                <span style="color: #d1d5db;">|</span>
                <a href="https://www.instagram.com/amulets.cz" style="color: #9333ea; text-decoration: none; margin: 0 10px;">Instagram</a>
                <span style="color: #d1d5db;">|</span>
                <a href="https://www.facebook.com/amulets.cz" style="color: #9333ea; text-decoration: none; margin: 0 10px;">Facebook</a>
              </div>
              
              <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px;">
                © 2026 Amulets.cz | Všechna práva vyhrazena<br />
                <a href="https://amulets.manus.space/ochrana-osobnich-udaju" style="color: #9ca3af; text-decoration: underline;">Ochrana osobních údajů</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send e-book email: ${response.status} ${errorText}`);
  }

  return await response.json();
}
