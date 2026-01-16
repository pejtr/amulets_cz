import { sendBrevoEmail } from "./brevo";

/**
 * Send PDF horoskop welcome email
 * Note: PDF generation is not implemented yet - this sends a placeholder email
 */
export async function sendHoroscopePDFEmail(
  email: string,
  zodiacSign: string,
  zodiacName: string
): Promise<boolean> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Váš PDF Horoskop 2026</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ✨ Váš PDF Horoskop 2026
              </h1>
              <p style="margin: 10px 0 0; color: #fce7f3; font-size: 16px;">
                ${zodiacName} - Kompletní předpověď
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Děkujeme za váš zájem! Jak jsme slíbili, zde je váš <strong>detailní PDF horoskop pro rok 2026</strong>.
              </p>
              
              <!-- PDF Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); border: 2px solid #9333ea; border-radius: 8px; padding: 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">📄</div>
                    <p style="margin: 0 0 10px; font-size: 18px; font-weight: bold; color: #374151;">
                      ${zodiacName} - Horoskop 2026
                    </p>
                    <p style="margin: 0 0 20px; font-size: 14px; color: #6b7280;">
                      Detailní PDF průvodce
                    </p>
                    
                    <!-- CTA Button -->
                    <a href="https://amulets.cz/predpoved-2026/predpoved-2026-${zodiacSign}" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold;">
                      📥 Zobrazit předpověď
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- What's Inside -->
              <div style="margin: 30px 0;">
                <p style="margin: 0 0 15px; font-size: 16px; font-weight: bold; color: #374151;">
                  Co obsahuje váš horoskop:
                </p>
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                  ✓ Měsíční předpovědi pro celý rok 2026
                </p>
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                  ✓ Doporučené amulety a kameny pro vaše znamení
                </p>
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                  ✓ Speciální rituály pro přilákání štěstí
                </p>
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                  ✓ Tipy pro lásku, kariéru, zdraví a finance
                </p>
              </div>
              
              <!-- Recommended Products -->
              <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0 0 10px; font-size: 14px; font-weight: bold; color: #92400e;">
                  💡 Tip: Posílit energii vašeho znamení
                </p>
                <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">
                  Prozkoumejte naše <strong>orgonitové pyramidy a esence</strong>, které jsou speciálně navrženy pro podporu vašeho znamení v roce 2026.
                </p>
                <p style="margin: 15px 0 0;">
                  <a href="https://www.ohorai.cz" style="color: #f59e0b; text-decoration: none; font-weight: bold;">
                    Prohlédnout produkty →
                  </a>
                </p>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                S láskou a pozitivní energií,<br>
                <strong>Natálie Ohorai & Tým Amulets.cz</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">
                © 2026 Amulets.cz | Otevřete své srdce zázrakům
              </p>
              <p style="margin: 0; font-size: 11px; color: #d1d5db;">
                Pokud si nepřejete dostávat další emaily, můžete se <a href="#" style="color: #9ca3af;">odhlásit zde</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendBrevoEmail({
    to: [{ email }],
    subject: `✨ Váš PDF Horoskop 2026 - ${zodiacName}`,
    htmlContent,
  });
}
