/**
 * Brevo (Sendinblue) Email Marketing Integration
 * 
 * This module provides helpers for:
 * - Adding contacts to Brevo lists
 * - Sending transactional emails
 * - Managing email campaigns
 */

const BREVO_API_URL = "https://api.brevo.com/v3";

interface BrevoContact {
  email: string;
  attributes?: Record<string, string | number | boolean>;
  listIds?: number[];
  updateEnabled?: boolean;
}

interface BrevoEmailParams {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  sender?: { name: string; email: string };
  replyTo?: { email: string; name?: string };
}

/**
 * Add or update a contact in Brevo
 */
export async function addBrevoContact(params: BrevoContact): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.warn("[Brevo] API key not configured");
    return false;
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email: params.email,
        attributes: params.attributes || {},
        listIds: params.listIds || [],
        updateEnabled: params.updateEnabled !== false, // Default true
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Brevo] Failed to add contact:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Brevo] Error adding contact:", error);
    return false;
  }
}

/**
 * Send a transactional email via Brevo
 */
export async function sendBrevoEmail(params: BrevoEmailParams): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.warn("[Brevo] API key not configured");
    return false;
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: params.sender || { name: "Amulets.cz", email: "info@amulets.cz" },
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        replyTo: params.replyTo,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Brevo] Failed to send email:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Brevo] Error sending email:", error);
    return false;
  }
}

/**
 * Send welcome email with discount code
 */
export async function sendDiscountWelcomeEmail(
  email: string,
  discountCode: string = "OHORAI11"
): Promise<boolean> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Váš slevový kód</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎁 Váš slevový kód je zde!
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Děkujeme za váš zájem o Amulets.cz! Jak jsme slíbili, zde je váš <strong>11% slevový kód</strong> na celý sortiment našeho eshopu Ohorai.cz.
              </p>
              
              <!-- Discount Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%); border: 2px dashed #9333ea; border-radius: 8px; padding: 20px; text-align: center;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">
                      Váš slevový kód:
                    </p>
                    <p style="margin: 0; font-size: 32px; font-weight: bold; color: #9333ea; letter-spacing: 2px;">
                      ${discountCode}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Benefits -->
              <div style="margin: 30px 0;">
                <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">
                  ✓ Platí na <strong>všechny produkty</strong> na Ohorai.cz
                </p>
                <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">
                  ✓ Orgonitové pyramidy, esence, amulety
                </p>
                <p style="margin: 0 0 15px; font-size: 14px; color: #6b7280;">
                  ✓ Sleva platí <strong>7 dní</strong>
                </p>
              </div>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://www.ohorai.cz/?discount=${discountCode}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">
                      Nakoupit na Ohorai.cz
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                S láskou,<br>
                <strong>Tým Amulets.cz</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © 2025 Amulets.cz | Otevřete své srdce zázrakům
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
    subject: `🎁 Váš 11% slevový kód: ${discountCode}`,
    htmlContent,
  });
}
