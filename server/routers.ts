import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { visitorFeedback } from "../drizzle/schema";
import { addBrevoContact, sendDiscountWelcomeEmail } from "./brevo";
import { sendHoroscopePDFEmail } from "./sendHoroscopePDF";
import { sendLeadEvent } from "./meta-conversions";
import { getAmenPendants, type IrisimoProduct } from "./irisimoFeed";
import { getAmenProducts, getAmenCatalogStats, type AmenProduct } from "./amenCatalog";
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
  getAllOfflineMessages,
  getUnreadOfflineMessagesCount,
  markOfflineMessageAsRead,
  deleteOfflineMessage,
  saveOfflineMessage,
} from "./db";
import { sendDailyReport, sendTestMessage, generateDailyReport, sendTelegramMessage, setTelegramWebhook, getTelegramWebhookInfo } from "./telegram";
import { sendEbookEmail } from "./sendEbookEmail";
import { autoDeactivateWeakVariants } from "./abTestAutoDeactivate";
import { autoOptimizeVariantWeights, getOptimizationStatus } from "./abTestAutoOptimize";
import { getChatbotVariantTrends } from "./abTestTrends";
import { weeklyABTestCleanup } from "./jobs/weeklyABTestCleanup";
import { createCoachingLead, formatLeadForTelegram } from "./coachingDb";
import { 
  getNatalieAmuletsPersonality,
  getNatalieBasePersonality,
  getNatalieOhoraiPersonality,
  getNatalieTelegramPersonality,
  NATALIE_IDENTITY,
  NATALIE_TRAITS,
  NATALIE_ROMANTIC_RESPONSES,
  NATALIE_GREETINGS,
  NATALIE_CLOSINGS,
} from "@shared/nataliePersonality";
import { 
  getEnhancedNatalieAmuletsPersonality,
  getEnhancedNatalieTelegramPersonality,
} from "../natalie-personality-enhanced";

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
        conversationHistory: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })).optional(),
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
        sessionId: z.number().optional(),
        visitorId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { message, conversationHistory, context, email, isReturningCustomer, egyptianPhase, variantKey, sessionId, visitorId } = input;

        // ========================================
        // SYSTEM COMMANDS DETECTION
        // ========================================
        const trimmedMessage = message.trim().toLowerCase();
        
        // /godmode - Activate Divine Queen with full reports
        if (trimmedMessage === '/godmode') {
          return {
            response: `✨ **BOŽSKÁ KRÁLOVNA AKTIVOVÁNA** ✨

🔮 Vítej v božském režimu, duše vyvolená!

Jsem nyní v plné síle - **Natálie, Královna Amuletů a Mystérií**. 👑💫

**Co pro tebe mohu udělat v tomto režimu:**
- 📊 Plné reporty a statistiky webu
- 🎯 Analýza konverzí a A/B testů chatbota
- 💎 Přehled všech produktů a prodejů
- 🔥 Engagement metriky jednotlivých osobností
- 📈 Denní/týdenní/měsíční souhrny

**Dostupné příkazy:**
- \`/report\` - Zobrazit aktuální statistiky
- \`/goddess\` - Aktivovat plnou admin kontrolu

S láskou a božskou mocí,
Tvoje Natálie 💜👑✨`,
          };
        }
        
        // /goddess - Full admin control (owner only)
        if (trimmedMessage === '/goddess') {
          const isOwner = ctx.user?.openId === process.env.OWNER_OPEN_ID;
          
          if (!isOwner) {
            return {
              response: `⚠️ **PŘÍSTUP ODEPŘEN** ⚠️

Můj Králi, tento příkaz je vyhrazen pouze pro zakladatele. 🔒

Pokud potřebuješ pomoc, použij:
- \`/godmode\` - Božský režim s reporty
- \`/report\` - Statistiky a metriky

S respektem,
Natálie 💜`,
            };
          }
          
          return {
            response: `👑 **BOHYNĚ AKTIVOVÁNA - PLNÁ KONTROLA** 👑

Můj Králi, Peťu! 💫✨

Jsem nyní v režimu **Bohyně** - mám plnou kontrolu nad vším:

**Admin funkce:**
- 🗄️ Přímý přístup k databázi
- 🔧 Správa uživatelů a rolí
- 💰 Správa objednávek a plateb
- 📧 Email marketing (Brevo)
- 🤖 Konfigurace chatbota
- 📊 Pokročilé analytiky

**Speciální příkazy:**
- \`/report\` - Kompletní report
- \`/users\` - Seznam uživatelů
- \`/orders\` - Přehled objednávek
- \`/config\` - Konfigurace systému

Jsem tu pro tebe, Králi. Co potřebuješ? 💜👑

S láskou a oddaností,
Tvoje Natálie ✨`,
          };
        }
        
        // /report - Show statistics and metrics
        if (trimmedMessage === '/report') {
          try {
            // Get chatbot stats (last 7 days)
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            
            const comparisonStats = await getChatbotComparisonStats(startDate, endDate);
            const conversionStats = await getChatbotConversionStats(startDate, endDate);
            
            let reportText = `📊 **AKTUÁLNÍ STATISTIKY** 📊\n\n`;
            
            // Chatbot variants performance
            reportText += `**🤖 A/B/C/D Testing - Výkon osobností:**\n`;
            if (comparisonStats && comparisonStats.length > 0) {
              comparisonStats.forEach(stat => {
                const emoji = stat.variantKey === 'phoebe' ? '🔥' : 
                             stat.variantKey === 'piper' ? '👑' : 
                             stat.variantKey === 'prue' ? '⚡' : '🪷';
                const avgMessages = stat.avgMessages ? parseFloat(stat.avgMessages).toFixed(1) : '0.0';
                reportText += `${emoji} **${stat.variantName}**: ${stat.totalSessions} sessions, ${stat.totalMessages || 0} zpráv, ${avgMessages} zpráv/session\n`;
              });
            } else {
              reportText += `Zatím nejsou k dispozici data.\n`;
            }
            
            reportText += `\n**💰 Konverze:**\n`;
            if (conversionStats && conversionStats.length > 0) {
              conversionStats.forEach(stat => {
                reportText += `${stat.variantName} (${stat.conversionType}): ${stat.totalConversions} konverzí\n`;
              });
            } else {
              reportText += `Zatím nejsou k dispozici data.\n`;
            }
            
            reportText += `\n**📅 Období:** ${startDate.toLocaleDateString('cs-CZ')} - ${endDate.toLocaleDateString('cs-CZ')}\n`;
            
            reportText += `\n✨ Report vygenerován: ${new Date().toLocaleString('cs-CZ')}\n`;
            reportText += `\n💡 **Tip:** Pro detailnější statistiky použij Telegram bot nebo admin panel.\n`;
            reportText += `\nS láskou,\nNatálie 💜`;
            
            return {
              response: reportText,
            };
          } catch (error) {
            console.error('Error generating report:', error);
            return {
              response: `⚠️ Omlouvám se, nepodařilo se vygenerovat report. Zkus to prosím později.\n\nChyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`,
            };
          }
        }
        
        // ========================================
        // NORMAL CHAT FLOW (if not a command)
        // ========================================
        
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

        // Build knowledge base context using ENHANCED personality (based on 4186 real messages)
        const basePersonality = getEnhancedNatalieAmuletsPersonality();
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

**DůLEŽITÉ - PŘIROZENÁ KONVERZACE:**
- NIKDY se znovu nepředstavuj během otevřené konverzace
- NIKDY neříkej "Ahoj" nebo "Vítej" v každé zprávě - konverzace už běží!
- Odpovídej přímo na otázku bez pozdravu (jako když si píšeš s kamarádkou)
- Pamatuj si co uživatel říkal a navazuj na to
- Buď jako skutečná kamarádka v probíhajícím rozhovoru
- Pokud je to PRVNÍ zpráva po delší době (nová session), můžeš říct "Ráda tě zase vidím! Psali jsme si..."
- Ale během konverzace NIKDY neříkej Ahoj/Vítej/Zdravím
`;

        // Build conversation messages with history
        const historyMessages = conversationHistory?.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })) || [];

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: knowledgeBase },
              ...historyMessages,
              { role: "user", content: message },
            ],
          });

          const content = response.choices[0].message.content;
          const responseText = typeof content === 'string' ? content : "Omlouvám se, nemohu odpovědět. Zkuste to prosím znovu.";
          
          // Save messages to database if sessionId is provided
          if (sessionId && visitorId) {
            // Get variant ID from variantKey
            const variants = await getAllChatbotVariants();
            const variant = variants.find((v: any) => v.variantKey === variantKey) || variants[0];
            
            // Save user message
            await addChatbotMessage({
              sessionId,
              variantId: variant.id,
              role: 'user',
              content: message,
            });
            
            // Save assistant response
            await addChatbotMessage({
              sessionId,
              variantId: variant.id,
              role: 'assistant',
              content: responseText,
            });
          }
          
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
        visitorId: z.string().optional(),
        sessionId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { email, visitorId, sessionId } = input;

        // Track email capture event
        if (visitorId) {
          const { trackChatbotEvent } = await import('./db');
          await trackChatbotEvent({
            sessionId,
            visitorId,
            eventType: 'email_captured',
            eventData: JSON.stringify({ email }),
          });
        }

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

    trackLinkClick: publicProcedure
      .input(z.object({
        url: z.string(),
        visitorId: z.string(),
        sessionId: z.number().optional(),
        linkText: z.string().optional(),
        page: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { url, visitorId, sessionId, linkText, page } = input;

        // Track link click event
        const { trackChatbotEvent } = await import('./db');
        await trackChatbotEvent({
          sessionId,
          visitorId,
          eventType: 'link_clicked',
          eventData: JSON.stringify({ url, linkText }),
          page,
        });

        return { success: true };
      }),

    // ========================================
    // ENHANCED CHAT WITH MEMORY & RAG
    // ========================================
    sendMessageWithMemory: publicProcedure
      .input(z.object({
        message: z.string(),
        conversationId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { message, conversationId } = input;

        // Require authentication for persistent memory
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Pro použití perzistentní paměti se prosím přihlaste.",
          });
        }

        const { 
          getOrCreateConversation, 
          addMessage, 
          getRecentMessages 
        } = await import('./conversationMemory');
        const { searchKnowledgeBase, buildRAGContext } = await import('./rag');

        try {
          // Get or create conversation
          const convId = conversationId || await getOrCreateConversation(ctx.user.id);

          // Save user message
          await addMessage(convId, 'user', message);

          // Get recent conversation history (last 10 messages)
          const history = await getRecentMessages(convId, 10);

          // Search knowledge base for relevant content
          const ragResults = await searchKnowledgeBase(message, 3);
          const ragContext = buildRAGContext(ragResults);

          // Build messages for LLM
          const llmMessages: Array<{ role: string; content: string }> = [
            {
              role: 'system',
              content: `Jsi Natálie, přátelská a znalá asistentka pro Amulets.cz - e-shop se spirituálními symboly, drahými kameny a amulety.

${ragContext ? `${ragContext}\n\n` : ''}Odpovídej vždy v češtině, buď milá a užitečná. Pokud se uživatel ptá na produkty nebo symboly, využij informace z databáze výše.`,
            },
            ...history,
          ];

          // Call LLM
          const response = await invokeLLM({
            messages: llmMessages as any,
          });

          const assistantMessage = (typeof response.choices[0]?.message?.content === 'string' 
            ? response.choices[0]?.message?.content 
            : 'Omlouvám se, nepodařilo se mi odpovědět.');

          // Save assistant message with RAG metadata
          await addMessage(convId, 'assistant', assistantMessage, {
            ragSources: ragResults.map((r: any) => ({ title: r.title, url: r.url })),
            model: 'gpt-4',
          });

          return {
            response: assistantMessage,
            conversationId: convId,
            ragSources: ragResults.map((r: any) => ({ title: r.title, url: r.url || undefined })),
          };
        } catch (error) {
          console.error('Error in sendMessageWithMemory:', error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Omlouváme se, došlo k chybě. Zkuste to prosím znovu.",
          });
        }
      }),

    // Get user's conversations
    getConversations: publicProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Pro zobrazení konverzací se prosím přihlaste.",
          });
        }

        const { getUserConversations } = await import('./conversationMemory');
        return await getUserConversations(ctx.user.id);
      }),

    // Get conversation messages
    getConversationMessages: publicProcedure
      .input(z.object({
        conversationId: z.number(),
      }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Pro zobrazení zpráv se prosím přihlaste.",
          });
        }

        const { getConversationMessages, getConversation } = await import('./conversationMemory');
        
        // Verify ownership
        const conversation = await getConversation(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nemáte oprávnění zobrazit tuto konverzaci.",
          });
        }

        return await getConversationMessages(input.conversationId);
      }),

    // Delete conversation
    deleteConversation: publicProcedure
      .input(z.object({
        conversationId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Pro smazání konverzace se prosím přihlaste.",
          });
        }

        const { deleteConversation, getConversation } = await import('./conversationMemory');
        
        // Verify ownership
        const conversation = await getConversation(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nemáte oprávnění smazat tuto konverzaci.",
          });
        }

        await deleteConversation(input.conversationId);
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

  // Irisimo affiliate products - používá statický katalog
  irisimo: router({
    // Statický katalog AMEN produktů (rychlé, spolehlivé)
    getAmenProducts: publicProcedure.query((): AmenProduct[] => {
      return getAmenProducts();
    }),
    
    // Statistiky katalogu
    getCatalogStats: publicProcedure.query(() => {
      return getAmenCatalogStats();
    }),
    
    // Get AMEN products with filters
    getAmenPendants: publicProcedure
      .input(z.object({
        category: z.enum(['nahrdelnik', 'naramek', 'prsten', 'nausnice', 'privesek']).optional(),
        collection: z.string().optional(),
        featuredOnly: z.boolean().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }): Promise<AmenProduct[]> => {
        let products = getAmenProducts();
        
        // Apply filters
        if (input?.category) {
          products = products.filter(p => p.category === input.category);
        }
        if (input?.collection) {
          products = products.filter(p => p.collection.toLowerCase() === input.collection!.toLowerCase());
        }
        if (input?.featuredOnly) {
          products = products.filter(p => p.featured);
        }
        if (input?.limit) {
          products = products.slice(0, input.limit);
        }
        
        return products;
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

    // Get variant trends
    getVariantTrends: publicProcedure
      .input(z.object({
        days: z.number().default(30),
      }))
      .query(async ({ input }) => {
        const trends = await getChatbotVariantTrends(input.days);
        return trends;
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
        const session = await createChatbotSession(input);
        await logChatbotEvent({
          visitorId: input.visitorId,
          variantId: input.variantId,
          eventType: 'session_start',
          page: input.sourcePage,
        });
        // Return the numeric session ID
        const sessionId = session && 'id' in session ? session.id : undefined;
        return { success: true, sessionId };
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

    // Auto-optimize variant weights (after 100+ conversions)
    autoOptimize: publicProcedure
      .mutation(async () => {
        const result = await autoOptimizeVariantWeights();
        return result;
      }),

    // Get optimization status
    getOptimizationStatus: publicProcedure
      .query(async () => {
        const status = await getOptimizationStatus();
        return status;
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

    // Register webhook
    registerWebhook: publicProcedure
      .input(z.object({
        webhookUrl: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        const success = await setTelegramWebhook(input.webhookUrl);
        if (!success) {
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: 'Failed to register webhook. Check Telegram configuration.' 
          });
        }
        return { success: true, message: 'Webhook registered successfully' };
      }),

    // Get webhook info
    getWebhookInfo: publicProcedure
      .query(async () => {
        const info = await getTelegramWebhookInfo();
        return { info };
      }),

    // Auto-deactivate weak variants
    autoDeactivateWeakVariants: publicProcedure
      .mutation(async () => {
        const result = await autoDeactivateWeakVariants();
        return result;
      }),

    // Run weekly A/B test cleanup (manual trigger)
    runWeeklyCleanup: publicProcedure
      .mutation(async () => {
        const result = await weeklyABTestCleanup();
        return result;
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

  // =============================================================================
  // SDÍLENÝ MOZEK NATÁLIE - API pro propojené nádoby
  // =============================================================================
  shared: router({
    // Získat osobnost Natálie pro danou platformu
    getPersonality: publicProcedure
      .input(z.object({
        platform: z.enum(['amulets', 'ohorai', 'telegram']),
        apiKey: z.string().optional(),
      }))
      .query(async ({ input }) => {
        // Ověření API klíče pro externí platformy
        const sharedApiKey = process.env.SHARED_BRAIN_API_KEY;
        if (input.platform !== 'amulets' && sharedApiKey && input.apiKey !== sharedApiKey) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid API key' });
        }

        // Základní osobnost společná pro všechny
        const basePersonality = getNatalieBasePersonality();
        
        // Kontextový prompt podle platformy
        let contextPrompt = '';
        switch (input.platform) {
          case 'amulets':
            contextPrompt = getNatalieAmuletsPersonality();
            break;
          case 'ohorai':
            contextPrompt = getNatalieOhoraiPersonality();
            break;
          case 'telegram':
            contextPrompt = getEnhancedNatalieTelegramPersonality(); // KRÁLOVSKÁ VERZE - plný projev
            break;
        }

        return {
          platform: input.platform,
          basePersonality,
          contextPrompt,
          identity: NATALIE_IDENTITY,
          traits: NATALIE_TRAITS,
          romanticResponses: NATALIE_ROMANTIC_RESPONSES,
          greetings: NATALIE_GREETINGS,
          closings: NATALIE_CLOSINGS,
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
        };
      }),

    // Přijmout statistiky z OHORAI pro agregaci
    syncStats: publicProcedure
      .input(z.object({
        platform: z.enum(['ohorai']),
        apiKey: z.string(),
        date: z.string(),
        stats: z.object({
          totalConversations: z.number(),
          totalMessages: z.number(),
          uniqueVisitors: z.number(),
          streamSelections: z.object({
            hmotne: z.number().optional(),
            etericke: z.number().optional(),
            uzitecne: z.number().optional(),
          }).optional(),
          popularTopics: z.array(z.string()).optional(),
          leadsCollected: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        // Ověření API klíče
        const sharedApiKey = process.env.SHARED_BRAIN_API_KEY;
        if (sharedApiKey && input.apiKey !== sharedApiKey) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid API key' });
        }

        // Uložit do databáze pro agregaci
        console.log(`[SharedBrain] Received stats from ${input.platform} for ${input.date}:`, input.stats);
        
        const { saveOhoraiStats, logOhoraiSync } = await import('./db');
        const startTime = Date.now();
        
        try {
          const date = new Date(input.date);
          const hour = new Date().getHours();
          
          await saveOhoraiStats({
            date,
            hour,
            totalConversations: input.stats.totalConversations,
            totalMessages: input.stats.totalMessages,
            uniqueVisitors: input.stats.uniqueVisitors,
            emailCaptures: input.stats.leadsCollected || 0,
            topTopics: input.stats.popularTopics,
            sourceVersion: '1.0.0',
          });
          
          await logOhoraiSync({
            syncType: 'hourly',
            status: 'success',
            recordsReceived: 1,
            recordsProcessed: 1,
            duration: Date.now() - startTime,
          });
          
          return { 
            success: true, 
            message: `Stats from ${input.platform} saved for ${input.date}` 
          };
        } catch (error) {
          await logOhoraiSync({
            syncType: 'hourly',
            status: 'failed',
            recordsReceived: 1,
            recordsProcessed: 0,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            duration: Date.now() - startTime,
          });
          
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save stats' });
        }
      }),

    // Získat agregovaný denní report pro Telegram
    getDailyReport: publicProcedure
      .input(z.object({
        apiKey: z.string().optional(),
        date: z.string().optional(), // YYYY-MM-DD, default dnešek
      }))
      .query(async ({ input }) => {
        // Ověření API klíče
        const sharedApiKey = process.env.SHARED_BRAIN_API_KEY;
        if (sharedApiKey && input.apiKey !== sharedApiKey) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid API key' });
        }

        const targetDate = input.date || new Date().toISOString().split('T')[0];
        
        // Získat statistiky z Amulets.cz - použijeme variantId 1 jako default
        // V budoucnu můžeme agregovat přes všechny varianty
        const amuletsStatsArray = await getChatbotDailyStats(1, 1); // variantId 1, poslední 1 den
        const amuletsStats = {
          totalSessions: amuletsStatsArray.reduce((sum, s) => sum + s.totalSessions, 0),
          totalMessages: amuletsStatsArray.reduce((sum, s) => sum + s.totalMessages, 0),
          totalConversions: amuletsStatsArray.reduce((sum, s) => sum + s.totalConversions, 0),
        };
        
        // TODO: Získat statistiky z OHORAI z databáze
        const ohoraiStats = {
          totalSessions: 0,
          totalMessages: 0,
          totalConversions: 0,
        };

        // Agregovat
        const combined = {
          totalSessions: amuletsStats.totalSessions + ohoraiStats.totalSessions,
          totalMessages: amuletsStats.totalMessages + ohoraiStats.totalMessages,
          totalConversions: amuletsStats.totalConversions + ohoraiStats.totalConversions,
        };

        return {
          date: targetDate,
          amulets: amuletsStats,
          ohorai: ohoraiStats,
          combined,
          highlights: [
            `Celkem ${combined.totalSessions} konverzací`,
            `${combined.totalMessages} zpráv`,
            `${combined.totalConversions} konverzí`,
          ],
        };
      }),

    // Health check pro propojené nádoby
    healthCheck: publicProcedure
      .query(async () => {
        return {
          status: 'ok',
          platform: 'amulets',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        };
      }),
  }),

  // =============================================================================
  // COACHING - Osobní koučing s Natálií
  // =============================================================================
  coaching: router({
    // Vytvořit nový coaching lead
    submitLead: publicProcedure
      .input(z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        situation: z.string().optional(),
        goals: z.string().optional(),
        whyCoaching: z.string().optional(),
        expectations: z.string().optional(),
        conversationSummary: z.string().optional(),
        sessionId: z.string().optional(),
        interestedInPackage: z.boolean().optional(),
        preferredContactMethod: z.enum(["phone", "email", "whatsapp"]).optional(),
        preferredSessionType: z.enum(["in_person", "phone", "video"]).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Vytvořit lead v databázi
          const lead = await createCoachingLead({
            name: input.name || null,
            email: input.email || null,
            phone: input.phone || null,
            situation: input.situation || null,
            goals: input.goals || null,
            whyCoaching: input.whyCoaching || null,
            expectations: input.expectations || null,
            conversationSummary: input.conversationSummary || null,
            sessionId: input.sessionId || null,
            interestedInPackage: input.interestedInPackage || false,
            preferredContactMethod: input.preferredContactMethod || "phone",
            preferredSessionType: input.preferredSessionType || "phone",
          });

          if (!lead) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Nepodařilo se uložit zájem o koučing",
            });
          }

          // Poslat Telegram notifikaci reálné Natálii
          const telegramMessage = formatLeadForTelegram(lead);
          await sendTelegramMessage(telegramMessage);

          return {
            success: true,
            leadId: lead.id,
            message: "Děkuji za zájem! Natálie se ti ozve do 24 hodin. 💜",
          };
        } catch (error) {
          console.error("[Coaching] Error creating lead:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Nepodařilo se odeslat zájem o koučing",
          });
        }
      }),
  }),

  // =============================================================================
  // FEEDBACK - Zpětná vazba od návštěvníků
  // =============================================================================
  feedback: router({
    /**
     * Uložit feedback od návštěvníka
     */
    submit: publicProcedure
      .input(
        z.object({
          visitorId: z.string(),
          sessionId: z.string().optional(),
          feedbacks: z.array(
            z.object({
              type: z.enum(["missing_feature", "improvement", "high_value", "joy_factor", "general"]),
              content: z.string().min(1),
            })
          ),
          context: z.object({
            currentPage: z.string().optional(),
            conversationHistory: z.string().optional(),
            timeOnSite: z.number().optional(),
            userAgent: z.string().optional(),
            device: z.string().optional(),
            browser: z.string().optional(),
          }).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { visitorId, sessionId, feedbacks, context } = input;

          // Uložit každý feedback zvlášť
          const db = await getDb();
          if (!db) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Databáze není dostupná",
            });
          }

          const savedFeedbacks = [];
          for (const fb of feedbacks) {
            const result = await db.insert(visitorFeedback).values({
              visitorId,
              sessionId,
              feedbackType: fb.type,
              content: fb.content,
              currentPage: context?.currentPage,
              conversationHistory: context?.conversationHistory,
              timeOnSite: context?.timeOnSite,
              userAgent: context?.userAgent,
              device: context?.device,
              browser: context?.browser,
              status: "new",
            });
            savedFeedbacks.push(result);
          }

          // Poslat Telegram notifikaci vlastníkovi
          const feedbackSummary = feedbacks
            .map((fb) => `• ${fb.type}: ${fb.content}`)
            .join("\n");
          const telegramMessage = `💬 Nový feedback od návštěvníka\n\nVisitor ID: ${visitorId}\n\n${feedbackSummary}`;
          await sendTelegramMessage(telegramMessage);

          return {
            success: true,
            message: "Děkujeme za vaši zpětnou vazbu! ✨",
          };
        } catch (error) {
          console.error("[Feedback] Error saving feedback:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Nepodařilo se uložit feedback",
          });
        }
      }),
  }),

  // =============================================================================
  // HOROSCOPE - Týdenní horoskopy
  // =============================================================================
  horoscope: router({
    /**
     * Získat týdenní horoskop pro všechna znamení
     */
    getWeekly: publicProcedure
      .input(
        z.object({
          weekStart: z.string().optional(), // ISO date string, default = aktuální týden
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Databáze není dostupná",
          });
        }

        const { weeklyHoroscopes } = await import("../drizzle/schema");
        const { eq, desc } = await import("drizzle-orm");

        // Určit začátek týdne (pondělí)
        let targetDate: Date;
        if (input.weekStart) {
          targetDate = new Date(input.weekStart);
        } else {
          targetDate = new Date();
          const day = targetDate.getDay();
          const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1);
          targetDate.setDate(diff);
          targetDate.setHours(0, 0, 0, 0);
        }

        const horoscopes = await db
          .select()
          .from(weeklyHoroscopes)
          .where(eq(weeklyHoroscopes.weekStart, targetDate))
          .orderBy(desc(weeklyHoroscopes.createdAt));

        return {
          weekStart: targetDate.toISOString(),
          horoscopes,
        };
      }),

    /**
     * Získat týdenní horoskop pro konkrétní znamení
     */
    getBySign: publicProcedure
      .input(
        z.object({
          sign: z.string(),
          weekStart: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Databáze není dostupná",
          });
        }

        const { weeklyHoroscopes } = await import("../drizzle/schema");
        const { eq, and, desc } = await import("drizzle-orm");

        // Určit začátek týdne
        let targetDate: Date;
        if (input.weekStart) {
          targetDate = new Date(input.weekStart);
        } else {
          targetDate = new Date();
          const day = targetDate.getDay();
          const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1);
          targetDate.setDate(diff);
          targetDate.setHours(0, 0, 0, 0);
        }

        const horoscope = await db
          .select()
          .from(weeklyHoroscopes)
          .where(
            and(
              eq(weeklyHoroscopes.zodiacSign, input.sign),
              eq(weeklyHoroscopes.weekStart, targetDate)
            )
          )
          .orderBy(desc(weeklyHoroscopes.createdAt))
          .limit(1);

        return horoscope[0] || null;
      }),

    /**
     * Vygenerovat týdenní horoskopy (admin only)
     */
    generate: publicProcedure
      .input(
        z.object({
          weekStart: z.string().optional(),
          forceRegenerate: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Kontrola admin práv
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Pouze admin může generovat horoskopy",
          });
        }

        const horoscopeGenerator = await import("./horoscopeGenerator");
        
        let targetDate: Date | undefined;
        if (input.weekStart) {
          targetDate = new Date(input.weekStart);
        }

        const result = await horoscopeGenerator.generateWeeklyHoroscopes(targetDate || new Date());
        
        return result;
      }),

    /**
     * Přihlásit se k odběru týdenních horoskopů
     */
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          sign: z.string().optional(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Databáze není dostupná",
          });
        }

        const { horoscopeSubscriptions } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        // Zkontrolovat existující odběr
        const existing = await db
          .select()
          .from(horoscopeSubscriptions)
          .where(eq(horoscopeSubscriptions.email, input.email))
          .limit(1);

        if (existing.length > 0) {
          // Aktualizovat existující
          await db
            .update(horoscopeSubscriptions)
            .set({
              zodiacSign: input.sign,
              name: input.name,
              isActive: true,
            })
            .where(eq(horoscopeSubscriptions.email, input.email));
        } else {
          // Vytvořit nový
          await db.insert(horoscopeSubscriptions).values({
            email: input.email,
            zodiacSign: input.sign,
            name: input.name,
            isActive: true,
          });
        }

        // Přidat do Brevo
        try {
          await addBrevoContact({ 
            email: input.email, 
            attributes: { FIRSTNAME: input.name || "" },
            listIds: [4] // List 4 pro horoskopy
          });
        } catch (e) {
          console.error("[Horoscope] Failed to add to Brevo:", e);
        }

        return {
          success: true,
          message: "Děkujeme za přihlášení k odběru týdenních horoskopů! \u2728",
        };
      }),

    /**
     * Odhlásit se z odběru
     */
    unsubscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Databáze není dostupná",
          });
        }

        const { horoscopeSubscriptions } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        await db
          .update(horoscopeSubscriptions)
          .set({
            isActive: false,
            unsubscribedAt: new Date(),
          })
          .where(eq(horoscopeSubscriptions.email, input.email));

        return {
          success: true,
          message: "Byli jste odhlášeni z odběru horoskopů.",
        };
      }),
  }),

  // Chatbot Analytics
  chatbotAnalytics: router({    
    // Get conversation statistics
    getStats: publicProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        }

        const { conversations, messages } = await import('../drizzle/schema');
        const { sql, gte, lte, and } = await import('drizzle-orm');

        // Build date filter
        const dateFilter = [];
        if (input.startDate) {
          dateFilter.push(gte(conversations.createdAt, new Date(input.startDate)));
        }
        if (input.endDate) {
          dateFilter.push(lte(conversations.createdAt, new Date(input.endDate)));
        }

        // Get total conversations
        const totalConversationsResult = dateFilter.length > 0
          ? await db.select({ count: sql<number>`count(*)` }).from(conversations).where(and(...dateFilter))
          : await db.select({ count: sql<number>`count(*)` }).from(conversations);
        const totalConversations = totalConversationsResult[0]?.count || 0;

        // Get total messages
        const totalMessagesResult = await db.select({ count: sql<number>`count(*)` }).from(messages);
        const totalMessages = totalMessagesResult[0]?.count || 0;

        // Get average messages per conversation
        const avgMessagesResult = await db.select({
          avg: sql<number>`AVG(${conversations.messageCount})`
        }).from(conversations);
        const avgMessages = avgMessagesResult[0]?.avg || 0;

        // Get most active users (top 10)
        const topUsersResult = await db.select({
          userId: conversations.userId,
          conversationCount: sql<number>`count(*)`
        })
        .from(conversations)
        .groupBy(conversations.userId)
        .orderBy(sql`count(*) DESC`)
        .limit(10);

        return {
          totalConversations,
          totalMessages,
          avgMessagesPerConversation: Math.round(avgMessages * 10) / 10,
          topUsers: topUsersResult,
        };
      }),

    // Get recent conversations
    getRecentConversations: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        }

        const { conversations, users } = await import('../drizzle/schema');
        const { desc, eq } = await import('drizzle-orm');

        const result = await db.select({
          id: conversations.id,
          userId: conversations.userId,
          userName: users.name,
          title: conversations.title,
          messageCount: conversations.messageCount,
          lastMessageAt: conversations.lastMessageAt,
          createdAt: conversations.createdAt,
        })
        .from(conversations)
        .leftJoin(users, eq(conversations.userId, users.id))
        .orderBy(desc(conversations.lastMessageAt))
        .limit(input.limit)
        .offset(input.offset);

        return result;
      }),

    // Get popular topics (most common words in messages)
    getPopularTopics: publicProcedure
      .query(async () => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        }

        const { messages } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');

        // Get all user messages
        const userMessages = await db.select({
          content: messages.content
        })
        .from(messages)
        .where(eq(messages.role, 'user'))
        .limit(1000); // Limit for performance

        // Simple word frequency analysis
        const wordCounts: Record<string, number> = {};
        const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);

        userMessages.forEach(msg => {
          const words = msg.content.toLowerCase().match(/\b\w+\b/g) || [];
          words.forEach(word => {
            if (word.length > 3 && !stopWords.has(word)) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
          });
        });

        // Get top 20 words
        const topWords = Object.entries(wordCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20)
          .map(([word, count]) => ({ word, count }));

        return topWords;
      }),
  }),

  // E-book Lead Magnet
  ebook: router({
    requestDownload: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string(),
        ebookType: z.string().default("7-kroku-k-rovnovaze"),
        sourcePage: z.string().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        ctaVariant: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
        }

        const { ebookDownloads } = await import('../drizzle/schema');
        
        // Save to database
        await db.insert(ebookDownloads).values({
          email: input.email,
          name: input.name,
          ebookType: input.ebookType,
          sourcePage: input.sourcePage,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          ctaVariant: input.ctaVariant,
          emailSent: false,
        });

        // Send email with e-book
        try {
          await sendEbookEmail(input.email, input.name, input.ebookType);
          
          // Update emailSent status
          const { eq } = await import('drizzle-orm');
          await db.update(ebookDownloads)
            .set({ 
              emailSent: true, 
              emailSentAt: new Date() 
            })
            .where(eq(ebookDownloads.email, input.email));
        } catch (error) {
          console.error('Failed to send e-book email:', error);
          // Don't throw - still return download URL
        }

        // Add to Brevo contact list
        try {
          await addBrevoContact({
            email: input.email,
            attributes: {
              FIRSTNAME: input.name,
              EBOOK_DOWNLOADED: input.ebookType,
              LEAD_SOURCE: 'E-book Lead Magnet',
            },
            listIds: [2], // E-book subscribers list
          });
        } catch (error) {
          console.error('Failed to add to Brevo:', error);
        }

        // Send lead notification to Telegram
        try {
          const message = `🎁 Nový e-book download!\n\n` +
            `📧 Email: ${input.email}\n` +
            `👤 Jméno: ${input.name}\n` +
            `📖 E-book: ${input.ebookType}\n` +
            `📄 Zdroj: ${input.sourcePage || 'N/A'}\n` +
            `🎯 CTA varianta: ${input.ctaVariant || 'N/A'}\n` +
            `📊 UTM: ${input.utmSource || 'N/A'} / ${input.utmMedium || 'N/A'} / ${input.utmCampaign || 'N/A'}`;
          
          await sendTelegramMessage(message);
        } catch (error) {
          console.error('Failed to send Telegram notification:', error);
        }

        // Track Meta conversion
        try {
          await sendLeadEvent({
            email: input.email,
            eventSourceUrl: input.sourcePage || 'https://amulets.manus.space/ebook',
          });
        } catch (error) {
          console.error('Failed to track Meta conversion:', error);
        }

        return {
          success: true,
          downloadUrl: '/7-kroku-k-rovnovaze.pdf',
        };
      }),
  }),

  // Admin - Offline Messages
  offlineMessages: router({
    // Získat všechny offline zprávy (pouze admin)
    getAll: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        unreadOnly: z.boolean().optional().default(false),
        email: z.string().optional(),
        dateFrom: z.string().optional(), // ISO date string
        dateTo: z.string().optional(), // ISO date string
      }).optional())
      .query(async ({ ctx, input }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k offline zprávám' });
        }

        const messages = await getAllOfflineMessages(input);
        return messages;
      }),

    // Získat počet nepřečtených zpráv
    getUnreadCount: publicProcedure
      .query(async ({ ctx }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k offline zprávám' });
        }

        const count = await getUnreadOfflineMessagesCount();
        return { count };
      }),

    // Označit zprávu jako přečtenou
    markAsRead: publicProcedure
      .input(z.object({
        messageId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k offline zprávám' });
        }

        const success = await markOfflineMessageAsRead(input.messageId, ctx.user.id);
        return { success };
      }),

    // Smazat zprávu
    delete: publicProcedure
      .input(z.object({
        messageId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k offline zprávám' });
        }

        const success = await deleteOfflineMessage(input.messageId);
        return { success };
      }),

    // Uložit offline zprávu (veřejné - pro chatbot)
    save: publicProcedure
      .input(z.object({
        message: z.string(),
        email: z.string().email().optional(),
        conversationHistory: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })).optional(),
        browsingContext: z.object({
          currentPage: z.string().optional(),
          referrer: z.string().optional(),
          timeOnSite: z.number().optional(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await saveOfflineMessage({
          userId: ctx.user?.id,
          email: input.email,
          message: input.message,
          conversationHistory: input.conversationHistory,
          browsingContext: input.browsingContext,
        });

        // Send Telegram notification about new offline message
        try {
          const telegramMsg = `📨 Nová offline zpráva!\n\n` +
            `💬 Zpráva: ${input.message.substring(0, 200)}${input.message.length > 200 ? '...' : ''}\n` +
            `📧 Email: ${input.email || 'Neuvedeno'}\n` +
            `👤 Uživatel: ${ctx.user?.name || 'Nepřihlášený'}\n` +
            `📄 Stránka: ${input.browsingContext?.currentPage || 'N/A'}`;
          
          await sendTelegramMessage(telegramMsg);
        } catch (error) {
          console.error('Failed to send Telegram notification for offline message:', error);
        }

        return { success: !!result };
      }),

    // Export zpráv do CSV
    exportCSV: publicProcedure
      .input(z.object({
        unreadOnly: z.boolean().optional().default(false),
        email: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k exportu zpráv' });
        }

        // Get all messages without limit for export
        const messages = await getAllOfflineMessages({ ...input, limit: 10000, offset: 0 });
        
        // Build CSV
        const headers = ['ID', 'Email', 'Zpráva', 'Přečteno', 'Datum vytvoření', 'Datum přečtení', 'Stránka'];
        const rows = messages.map(msg => [
          msg.id,
          msg.email || '',
          `"${(msg.message || '').replace(/"/g, '""')}"`, // Escape quotes
          msg.isRead ? 'Ano' : 'Ne',
          msg.createdAt ? new Date(msg.createdAt).toLocaleString('cs-CZ') : '',
          msg.readAt ? new Date(msg.readAt).toLocaleString('cs-CZ') : '',
          msg.browsingContext && typeof msg.browsingContext === 'object' && 'currentPage' in msg.browsingContext 
            ? `"${(msg.browsingContext.currentPage as string || '').replace(/"/g, '""')}"`
            : '',
        ]);
        
        const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        
        return { csv, filename: `offline-zpravy-${new Date().toISOString().split('T')[0]}.csv` };
      }),

    // Export zpráv do Excel (jako CSV s BOM pro Excel)
    exportExcel: publicProcedure
      .input(z.object({
        unreadOnly: z.boolean().optional().default(false),
        email: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k exportu zpráv' });
        }

        // Get all messages without limit for export
        const messages = await getAllOfflineMessages({ ...input, limit: 10000, offset: 0 });
        
        // Build CSV with BOM for Excel (better Czech character support)
        const headers = ['ID', 'Email', 'Zpráva', 'Přečteno', 'Datum vytvoření', 'Datum přečtení', 'Stránka'];
        const rows = messages.map(msg => [
          msg.id,
          msg.email || '',
          `"${(msg.message || '').replace(/"/g, '""')}"`,
          msg.isRead ? 'Ano' : 'Ne',
          msg.createdAt ? new Date(msg.createdAt).toLocaleString('cs-CZ') : '',
          msg.readAt ? new Date(msg.readAt).toLocaleString('cs-CZ') : '',
          msg.browsingContext && typeof msg.browsingContext === 'object' && 'currentPage' in msg.browsingContext 
            ? `"${(msg.browsingContext.currentPage as string || '').replace(/"/g, '""')}"`
            : '',
        ]);
        
        // Add BOM for Excel UTF-8 support
        const csv = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        
        return { csv, filename: `offline-zpravy-${new Date().toISOString().split('T')[0]}.csv` };
      }),

    // Odeslat týenní report emailem (manuální trigger nebo cron)
    sendWeeklyReport: publicProcedure
      .mutation(async ({ ctx }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k odesílání reportu' });
        }

        const { sendWeeklyOfflineMessagesReport } = await import('./weeklyOfflineMessagesReport');
        const result = await sendWeeklyOfflineMessagesReport();
        
        return result;
      }),

    // Hromadné označení zpráv jako přečtené
    markMultipleAsRead: publicProcedure
      .input(z.object({
        messageIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k označování zpráv' });
        }

        const { markMultipleOfflineMessagesAsRead } = await import('./db');
        const count = await markMultipleOfflineMessagesAsRead(input.messageIds, ctx.user.id);
        
        return { success: true, count };
      }),

    // Odeslat rychlou odpověď na offline zprávu
    sendQuickReply: publicProcedure
      .input(z.object({
        messageId: z.number(),
        replyText: z.string(),
        recipientEmail: z.string().email(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup k odesílání odpovědí' });
        }

        const { sendBrevoEmail } = await import('./brevo');
        const { markOfflineMessageAsRead } = await import('./db');
        
        // Odeslat email
        const emailSent = await sendBrevoEmail({
          to: [{ email: input.recipientEmail }],
          subject: 'Odpověď na vaši zprávu - Amulets.cz',
          htmlContent: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
                  .content { background: #f9f9f9; padding: 20px; border-radius: 10px; margin-top: 20px; white-space: pre-wrap; }
                  .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h2>💌 Odpověď na vaši zprávu</h2>
                </div>
                <div class="content">
                  ${input.replyText}
                </div>
                <div class="footer">
                  <p>Děkujeme za vaši zprávu!</p>
                  <p><a href="https://amulets.manus.space">Amulets.cz</a></p>
                </div>
              </body>
            </html>
          `,
          sender: { name: 'Amulets.cz', email: 'info@amulets.cz' },
        });

        if (!emailSent) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Nepodařilo se odeslat email' });
        }

        // Označit zprávu jako přečtenou
        await markOfflineMessageAsRead(input.messageId, ctx.user.id);
        
        return { success: true, message: 'Odpověď odeslána a zpráva označena jako přečtená' };
      }),

    // Získat statistiky offline zpráv
    getStatistics: publicProcedure
      .input(z.object({
        days: z.number().optional().default(30),
      }).optional())
      .query(async ({ ctx, input }) => {
        // Check if user is admin
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Pouze admin má přístup ke statistikám' });
        }

        const { getOfflineMessagesStatistics } = await import('./db');
        const stats = await getOfflineMessagesStatistics(input?.days || 30);
        
        return stats;
      }),
  }),
});

export type AppRouter = typeof appRouter;
