/**
 * Process Pending Tickets Job
 * 
 * This job runs during working hours (9:00-24:00) to:
 * 1. Fetch pending tickets
 * 2. Generate personalized AI responses based on conversation history
 * 3. Send email responses via Brevo
 * 4. Update ticket status and save response to chat history
 */

import { invokeLLM } from "../_core/llm";
import { sendBrevoEmail } from "../brevo";
import { 
  getPendingChatbotTickets, 
  answerChatbotTicket,
  addChatbotMessage
} from "../db";

interface Message {
  role: string;
  content: string;
  timestamp?: string;
}

/**
 * Check if current time is within working hours (9:00-24:00 CET)
 */
function isWorkingHours(): boolean {
  const now = new Date();
  // Convert to CET (UTC+1)
  const cetHour = (now.getUTCHours() + 1) % 24;
  return cetHour >= 9 && cetHour < 24;
}

/**
 * Generate personalized response using LLM based on conversation history
 */
async function generatePersonalizedResponse(
  customerName: string,
  customerMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  // Build context from conversation history
  const historyContext = conversationHistory
    .slice(-10) // Last 10 messages
    .map(m => `${m.role === 'user' ? 'Zákazník' : 'Natálie'}: ${m.content}`)
    .join('\n');

  const systemPrompt = `Jsi Natálie Ohorai, průvodkyně procesem a spirituální poradkyně z Amulets.cz.
Tvůj styl komunikace:
- Vřelý, empatický a autentický
- Používáš emoji střídmě (💜, ✨, 🌟)
- Oslovuješ zákazníky křestním jménem
- Nabízíš konkrétní rady a doporučení produktů
- Jsi znalkyně spirituálních symbolů, drahých kamenů a ezoteriky

Tvým úkolem je odpovědět na dotaz zákazníka emailem. Odpověď by měla:
1. Být personalizovaná na základě předchozí konverzace
2. Přímo odpovídat na položený dotaz
3. Nabídnout konkrétní produkty nebo rady
4. Pozvat k další komunikaci

Formát odpovědi:
- Začni pozdravem se jménem zákazníka
- Odpověz na dotaz
- Nabídni další pomoc
- Podepis: "S láskou, Natálie 💜"`;

  const userPrompt = `Předchozí konverzace:
${historyContext || 'Žádná předchozí konverzace'}

Jméno zákazníka: ${customerName}
Nový dotaz: ${customerMessage}

Napiš emailovou odpověď v češtině:`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : getDefaultResponse(customerName);
  } catch (error) {
    console.error("[ProcessTickets] LLM error:", error);
    return getDefaultResponse(customerName);
  }
}

/**
 * Default response if LLM fails
 */
function getDefaultResponse(customerName: string): string {
  return `Milá/ý ${customerName},

děkuji za váš dotaz! 💜

Omlouvám se za zpoždění - váš dotaz jsem právě obdržela a brzy se vám ozvu s podrobnou odpovědí.

Mezitím se můžete podívat na naše průvodce symboly na Amulets.cz nebo mě kontaktovat na WhatsApp: 776 041 740.

S láskou,
Natálie 💜

---
Amulets.cz - Otevřete své srdce zázrakům
www.amulets.cz`;
}

/**
 * Send email response to customer
 */
async function sendTicketResponse(
  email: string,
  name: string,
  response: string,
  ticketId: number
): Promise<boolean> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); padding: 30px 20px; text-align: center;">
              <img src="https://amulets.cz/images/natalie-avatar.png" alt="Natálie" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid white; margin-bottom: 10px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                Natálie vám odpovídá 💜
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-wrap;">
${response.replace(/\n/g, '<br>')}
              </div>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://www.amulets.cz/?utm_source=ticket&utm_medium=email&utm_campaign=ticket_response" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 14px; font-weight: bold; margin-right: 10px;">
                      Navštívit Amulets.cz
                    </a>
                    <a href="https://wa.me/420776041740" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 14px; font-weight: bold;">
                      📱 WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">
                Toto je odpověď na váš dotaz #${ticketId} z Amulets.cz
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © 2026 Amulets.cz | Otevřete své srdce zázrakům
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
    to: [{ email, name }],
    subject: `💜 Natálie vám odpovídá - Amulets.cz`,
    htmlContent,
    sender: { name: "Natálie z Amulets.cz", email: "natalie@amulets.cz" },
    replyTo: { email: "info@amulets.cz", name: "Amulets.cz" },
  });
}

/**
 * Process a single ticket
 */
async function processTicket(ticket: {
  id: number;
  name: string;
  email: string;
  message: string;
  conversationHistory: string | null;
  sessionId: number | null;
}): Promise<boolean> {
  console.log(`[ProcessTickets] Processing ticket #${ticket.id} for ${ticket.email}`);

  try {
    // Parse conversation history
    let conversationHistory: Message[] = [];
    if (ticket.conversationHistory) {
      try {
        conversationHistory = JSON.parse(ticket.conversationHistory);
      } catch {
        console.warn(`[ProcessTickets] Failed to parse conversation history for ticket #${ticket.id}`);
      }
    }

    // Generate personalized response
    const response = await generatePersonalizedResponse(
      ticket.name,
      ticket.message,
      conversationHistory
    );

    // Send email
    const emailSent = await sendTicketResponse(
      ticket.email,
      ticket.name,
      response,
      ticket.id
    );

    if (!emailSent) {
      console.error(`[ProcessTickets] Failed to send email for ticket #${ticket.id}`);
      return false;
    }

    // Update ticket status
    await answerChatbotTicket(ticket.id, response, 'ai');

    // If we have a sessionId, also add the response to chat history
    // This allows the user to see the response when they return to the chat
    if (ticket.sessionId) {
      await addChatbotMessage({
        sessionId: ticket.sessionId,
        variantId: 1, // Default variant
        role: 'assistant',
        content: `[Email odpověď]\n\n${response}`,
      });
    }

    console.log(`[ProcessTickets] Successfully processed ticket #${ticket.id}`);
    return true;
  } catch (error) {
    console.error(`[ProcessTickets] Error processing ticket #${ticket.id}:`, error);
    return false;
  }
}

/**
 * Main job function - process all pending tickets
 */
export async function processAllPendingTickets(): Promise<{
  processed: number;
  failed: number;
  skipped: number;
}> {
  const result = { processed: 0, failed: 0, skipped: 0 };

  // Check working hours
  if (!isWorkingHours()) {
    console.log("[ProcessTickets] Outside working hours (9:00-24:00 CET), skipping");
    return result;
  }

  // Get pending tickets
  const tickets = await getPendingChatbotTickets();
  console.log(`[ProcessTickets] Found ${tickets.length} pending tickets`);

  if (tickets.length === 0) {
    return result;
  }

  // Process each ticket
  for (const ticket of tickets) {
    const success = await processTicket(ticket);
    if (success) {
      result.processed++;
    } else {
      result.failed++;
    }

    // Small delay between tickets to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`[ProcessTickets] Completed: ${result.processed} processed, ${result.failed} failed`);
  return result;
}

// Export for manual testing
export { generatePersonalizedResponse, sendTicketResponse, isWorkingHours };
