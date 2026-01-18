import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { addBrevoContact, sendDiscountWelcomeEmail } from "./brevo";
import { sendHoroscopePDFEmail } from "./sendHoroscopePDF";
import { sendLeadEvent } from "./meta-conversions";
import { getAmenPendants, type IrisimoProduct } from "./irisimoFeed";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";
import { 
  getRandomChatbotVariant, 
  getChatbotVariantByKey, 
  getAllChatbotVariants,
  createChatbotSession,
  updateChatbotSession,
  addChatbotMessage,
  logChatbotEvent,
  getChatbotSessionBySessionId,
  getChatbotComparisonStats,
  getChatbotDailyStats,
  trackChatbotConversion,
  getChatbotConversionStats,
  getChatbotAffiliateStats,
  getChatbotConversionFunnel,
  createChatbotTicket,
  getChatbotTicketById,
  getPendingChatbotTickets,
  answerChatbotTicket,
  getAllChatbotTickets,
  getChatbotTicketsByVisitor,
} from "./db";
import { sendDailyReport, sendTestMessage, generateDailyReport } from "./telegram";
import { getNatalieAmuletsPersonality } from "@shared/nataliePersonality";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // AI Chat Assistant
  chat: router({
    sendMessage: publicProcedure
      .input(z.object({
        message: z.string(),
        context: z.object({
          currentPage: z.string(),
          referrer: z.string(),
          timeOnSite: z.number(),
          browsingHistory: z.string().optional(),
        }).optional(),
        email: z.string().email().optional(),
        isReturningCustomer: z.boolean().optional(),
        egyptianPhase: z.number().optional(),
        variantKey: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { message, context, email, isReturningCustomer, egyptianPhase, variantKey } = input;

        // Egyptian mystery sales sequence for returning customers
        const egyptianSequencePrompt = isReturningCustomer && egyptianPhase && egyptianPhase > 0 ? `

**EGYPTSKÁ PRODEJNÍ SEKVENCE (FÁZE ${egyptianPhase}):**
Jsi v egyptské prodejní sekvenci. Jemně směřuj konverzaci k egyptským mystériím a modrému lotosu.

${egyptianPhase === 1 ? `FÁZE 1 - PROBOUZENÍ ZÁJMU:
- Zmíň egyptskou symboliku a její sílu
- Napič: "Víš, že starí Egypťané věřili, že amulety chrání duši na cestě do posmrtného života?"
- Zmíň Horovo oko, Ankh, nebo skarabea` : ''}
${egyptianPhase === 2 ? `FÁZE 2 - MODRÝ LOTOS:
- Představ modrý lotos jako posvátnou květinu faraonů
- Napiš: "Modrý lotos byl nejposvátnější květinou starověkého Egypta... Kněží ho používali pro spojení s vyššími dimenzemi."
- Zmíň jeho relaxační a meditativní účinky` : ''}
${egyptianPhase === 3 ? `FÁZE 3 - PRODUKTY:
- Doporuč konkrétní produkty s modrým lotosem
- Zmíň OHORAI esenciální oleje s modrým lotosem
- Napiš: "Máme něco speciálního - esenciální olej z modrého lotosu, který pomáhá při meditaci a relaxaci..."` : ''}
${egyptianPhase >= 4 ? `FÁZE 4 - UZAVŘENÍ:
- Nabídni speciální slevu nebo dárek
- Napiš: "Pro tebe mám něco speciálního - sleva 10% na první nákup s kódem LOTOS10"
- Směřuj k nákupu` : ''}
` : '';

        // Build knowledge base context using shared personality
        const basePersonality = getNatalieAmuletsPersonality();
        const knowledgeBase = `
${basePersonality}
${egyptianSequencePrompt}

**Produkty Amulets.cz:**
- **Amulety a talismany**: 33 posvaćtných symbolů (Květ života, Merkaba, Om, Hamsa, atd.)
- **Orgonit pyramidy**: Ručně vyráběné, kombinace krystalů a kovů pro harmonizaci energie
- **Aromaterapie**: Esenciální oleje, difuzéry, aroma šperky
- **Drahokamy**: Ametyst, růžový křemen, čitrín, lápis lazuli, obsidián
- **Čínský horoskop**: Personalizované PDF s výkladem znamení

**Klíčové informace:**
- Doprava zdarma nad 1500 Kč
- Ruční výroba v Česku
- 30 dní na vrácení
- Kontakt: 776 041 740, info@amulets.cz

**Aktualni kontext:**
${context ? `- Stranka: ${context.currentPage}\n- Cas na webu: ${context.timeOnSite}s\n- Historie: ${context.browsingHistory || 'Nový návštěvník'}` : ''}
${email ? `- Email: ${email}` : ''}
`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: knowledgeBase },
              { role: "user", content: message },
            ],
          });

          const content = response.choices[0].message.content;
          const responseText = typeof content === 'string' ? content : "Omlouvám se, nemohu odpovědět. Zkuste to prosím znovu.";
          
          return {
            response: responseText,
          };
        } catch (error) {
          console.error("Chat LLM error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Omlouváme se, došlo k chybě. Zkuste to prosím znovu.",
          });
        }
      }),

    captureEmail: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        const { email } = input;

        // Add to Brevo with chat_engaged tag
        const contactAdded = await addBrevoContact({
          email,
          attributes: {
            SOURCE: "chat_widget",
            SIGNUP_DATE: new Date().toISOString(),
          },
          listIds: [3],
        });

        if (!contactAdded) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Nepodařilo se uložit email. Zkuste to prosím znovu.",
          });
        }

        return { success: true };
      }),
  }),

  // Newsletter subscription for lead magnets
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        source: z.string(), // e.g., "horoskop-krysa"
        tags: z.array(z.string()).optional(),
        fbc: z.string().optional(),
        fbp: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { email, source, tags = [] } = input;
        
        // Add contact to Brevo
        const contactAdded = await addBrevoContact({
          email,
          attributes: {
            SOURCE: source,
            SIGNUP_DATE: new Date().toISOString(),
          },
          listIds: [3], // Brevo list ID for newsletter
        });
        
        if (!contactAdded) {
          throw new Error("Nepodařilo se přidat email do databáze. Zkuste to prosím znovu.");
        }
        
        // Send PDF horoskop email if source is horoskop
        if (source.startsWith("horoskop-")) {
          const zodiacSign = source.replace("horoskop-", "").replace("-inline", "");
          const zodiacNameMap: Record<string, string> = {
            "krysa": "Krysa", "buvol": "Bůvol", "tygr": "Tygr", "kralik": "Králík",
            "drak": "Drak", "had": "Had", "kun": "Kůň", "koza": "Koza",
            "opice": "Opice", "kohout": "Kohout", "pes": "Pes", "prase": "Prase"
          };
          const zodiacName = zodiacNameMap[zodiacSign] || "Vaše znamení";
          await sendHoroscopePDFEmail(email, zodiacSign, zodiacName);
        }
        
        // Send Lead event to Meta Conversions API
        const clientIp = ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string || ctx.req.socket.remoteAddress;
        const userAgent = ctx.req.headers['user-agent'];
        const referer = ctx.req.headers['referer'] || 'https://amulets.cz';
        
        await sendLeadEvent({
          email,
          eventSourceUrl: referer,
          clientIp,
          userAgent,
          fbc: input.fbc,
          fbp: input.fbp,
        });
        
        return { success: true };
      }),
  }),

  // Irisimo affiliate products
  irisimo: router({
    getAmenPendants: publicProcedure.query(async (): Promise<IrisimoProduct[]> => {
      try {
        const pendants = await getAmenPendants();
        return pendants;
      } catch (error) {
        console.error('Error fetching AMEN pendants:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch AMEN pendants',
        });
      }
    }),
  }),

  // Email marketing
  email: router({
    subscribeDiscount: publicProcedure
      .input(z.object({ 
        email: z.string().email(),
        fbc: z.string().optional(),
        fbp: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { email } = input;
        
        // Add contact to Brevo
        const contactAdded = await addBrevoContact({
          email,
          attributes: {
            SOURCE: "exit_intent_popup",
            DISCOUNT_CODE: "OHORAI11",
          },
          listIds: [3], // Brevo list ID
        });
        
        if (!contactAdded) {
          throw new Error("Failed to add contact to email list");
        }
        
        // Send welcome email with discount code
        const emailSent = await sendDiscountWelcomeEmail(email, "OHORAI11");
        
        if (!emailSent) {
          throw new Error("Failed to send welcome email");
        }
        
        // Send Lead event to Meta Conversions API
        const clientIp = ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string || ctx.req.socket.remoteAddress;
        const userAgent = ctx.req.headers['user-agent'];
        const referer = ctx.req.headers['referer'] || 'https://amulets.cz';
        
        await sendLeadEvent({
          email,
          eventSourceUrl: referer,
          clientIp,
          userAgent,
          fbc: input.fbc,
          fbp: input.fbp,
        });
        
        return { success: true };
      }),

    sendCampaignEmail: publicProcedure
      .input(z.object({
        email: z.string().email(),
        campaignType: z.enum(['amuletToOhorai', 'ohoraiToAmulets', 'vipOffer']),
        firstName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { sendBrevoEmail, emailTemplates } = await import('./brevo');
          const template = emailTemplates[input.campaignType as keyof typeof emailTemplates];
          
          if (!template) {
            throw new Error('Invalid campaign type');
          }

          const htmlContent = template.htmlContent
            .replace('{{firstName}}', input.firstName || 'Milá')
            .replace('{{expiryDate}}', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('cs-CZ'));

          const success = await sendBrevoEmail({
            to: [{ email: input.email }],
            subject: template.subject,
            htmlContent,
          });

          return { success, message: success ? 'Email sent successfully' : 'Failed to send email' };
        } catch (error) {
          console.error('Error sending campaign email:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to send email',
          });
        }
      }),
  }),

  // Chatbot A/B Testing
  chatbotAB: router({
    // Get random variant for new visitor
    getVariant: publicProcedure
      .input(z.object({
        visitorId: z.string(),
        variantKey: z.string().optional(), // Force specific variant for testing
      }))
      .query(async ({ input }) => {
        if (input.variantKey) {
          const variant = await getChatbotVariantByKey(input.variantKey);
          return variant;
        }
        return getRandomChatbotVariant();
      }),

    // Get all variants (for admin)
    getAllVariants: publicProcedure.query(async () => {
      return getAllChatbotVariants();
    }),

    // Start new session
    startSession: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        visitorId: z.string(),
        variantId: z.number(),
        sourcePage: z.string().optional(),
        referrer: z.string().optional(),
        device: z.string().optional(),
        browser: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createChatbotSession(input);
        await logChatbotEvent({
          visitorId: input.visitorId,
          variantId: input.variantId,
          eventType: 'session_start',
          page: input.sourcePage,
        });
        return { success: true };
      }),

    // End session
    endSession: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        duration: z.number(),
        messageCount: z.number(),
        userMessageCount: z.number(),
        botMessageCount: z.number(),
        categoryClicks: z.number(),
        questionClicks: z.number(),
        converted: z.boolean().optional(),
        conversionType: z.string().optional(),
        conversionValue: z.string().optional(),
        satisfactionScore: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateChatbotSession(input.sessionId, {
          endedAt: new Date(),
          duration: input.duration,
          messageCount: input.messageCount,
          userMessageCount: input.userMessageCount,
          botMessageCount: input.botMessageCount,
          categoryClicks: input.categoryClicks,
          questionClicks: input.questionClicks,
          converted: input.converted,
          conversionType: input.conversionType,
          conversionValue: input.conversionValue,
          satisfactionScore: input.satisfactionScore,
          status: 'completed',
        });
        return { success: true };
      }),

    // Log event
    logEvent: publicProcedure
      .input(z.object({
        sessionId: z.number().optional(),
        variantId: z.number().optional(),
        visitorId: z.string(),
        eventType: z.string(),
        eventData: z.string().optional(),
        page: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await logChatbotEvent(input);
        return { success: true };
      }),

    // Get comparison stats (for admin dashboard)
    getComparisonStats: publicProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return getChatbotComparisonStats(startDate, endDate);
      }),

    // Get daily stats for a variant
    getDailyStats: publicProcedure
      .input(z.object({
        variantId: z.number(),
        days: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return getChatbotDailyStats(input.variantId, input.days || 30);
      }),

    // Track conversion event
    trackConversion: publicProcedure
      .input(z.object({
        sessionId: z.number().optional(),
        variantId: z.number(),
        visitorId: z.string(),
        conversionType: z.enum(['email_capture', 'whatsapp_click', 'affiliate_click', 'purchase', 'newsletter']),
        conversionSubtype: z.string().optional(),
        conversionValue: z.string().optional(),
        currency: z.string().optional(),
        productId: z.string().optional(),
        productName: z.string().optional(),
        affiliatePartner: z.string().optional(),
        referralUrl: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }))
      .mutation(async ({ input }) => {
        await trackChatbotConversion(input);
        return { success: true };
      }),

    // Get conversion stats by variant and type
    getConversionStats: publicProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return getChatbotConversionStats(startDate, endDate);
      }),

    // Get affiliate click stats
    getAffiliateStats: publicProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return getChatbotAffiliateStats(startDate, endDate);
      }),

    // Get conversion funnel for a variant
    getConversionFunnel: publicProcedure
      .input(z.object({
        variantId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return getChatbotConversionFunnel(input.variantId, startDate, endDate);
      }),

    // ============================================
    // OFFLINE TICKET SYSTEM
    // ============================================

    // Create a new ticket (for offline hours)
    createTicket: publicProcedure
      .input(z.object({
        visitorId: z.string(),
        variantId: z.number().optional(),
        sessionId: z.number().optional(),
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(1),
        conversationHistory: z.string().optional(),
        sourcePage: z.string().optional(),
        device: z.string().optional(),
        browser: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createChatbotTicket(input);
        if (!result) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create ticket' });
        }
        return { success: true, ticketId: result.insertId };
      }),

    // Get ticket by ID
    getTicket: publicProcedure
      .input(z.object({ ticketId: z.number() }))
      .query(async ({ input }) => {
        return getChatbotTicketById(input.ticketId);
      }),

    // Get tickets by visitor
    getVisitorTickets: publicProcedure
      .input(z.object({ visitorId: z.string() }))
      .query(async ({ input }) => {
        return getChatbotTicketsByVisitor(input.visitorId);
      }),

    // Get pending tickets (admin)
    getPendingTickets: publicProcedure
      .query(async () => {
        return getPendingChatbotTickets();
      }),

    // Get all tickets with filters (admin)
    getAllTickets: publicProcedure
      .input(z.object({
        status: z.enum(['pending', 'answered', 'all']).default('all'),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return getAllChatbotTickets(input.status, input.limit, input.offset);
      }),

    // Answer a ticket (admin or AI)
    answerTicket: publicProcedure
      .input(z.object({
        ticketId: z.number(),
        response: z.string().min(1),
        respondedBy: z.string().default('ai'),
      }))
      .mutation(async ({ input }) => {
        const result = await answerChatbotTicket(input.ticketId, input.response, input.respondedBy);
        if (!result) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to answer ticket' });
        }
        return { success: true };
      }),
  }),

  // Telegram Integration
  telegram: router({
    // Send daily report manually
    sendDailyReport: publicProcedure
      .mutation(async () => {
        const success = await sendDailyReport();
        if (!success) {
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: 'Failed to send daily report. Check Telegram configuration.' 
          });
        }
        return { success: true, message: 'Daily report sent to Telegram' };
      }),

    // Send test message
    sendTestMessage: publicProcedure
      .mutation(async () => {
        const success = await sendTestMessage();
        if (!success) {
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: 'Failed to send test message. Check Telegram configuration.' 
          });
        }
        return { success: true, message: 'Test message sent to Telegram' };
      }),

    // Preview report (without sending)
    previewReport: publicProcedure
      .query(async () => {
        const report = await generateDailyReport();
        return { report };
      }),

    // Check configuration status
    checkConfig: publicProcedure
      .query(async () => {
        // Import dynamically to get fresh env values
        const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;
        const hasChatId = !!process.env.TELEGRAM_CHAT_ID;
        console.log('[Telegram] Config check - Token:', hasToken, 'ChatId:', hasChatId);
        return {
          configured: hasToken && hasChatId,
          hasToken,
          hasChatId,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
