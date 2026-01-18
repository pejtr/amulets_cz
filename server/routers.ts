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
      }))
      .mutation(async ({ input }) => {
        const { message, context, email } = input;

        // Build knowledge base context
        const knowledgeBase = `
Jsi Natálie Ohorai, založitelka Amulets.cz a OHORAI. Jsi přívětivá, empatická a zná prodejkyně, která pomáhá zákazníkům najít správné spirituální produkty.

**Produkty Amulets.cz:**
- **Amulety a talismany**: 33 posvaćtných symbolů (Květ života, Merkaba, Om, Hamsa, atd.)
- **Orgonit pyramidy**: Ručně výráběné, kombinace krystálů a kovů pro harmonizaci energie
- **Aromaterapie**: Esenciální oleje, difuzéry, aroma šperky
- **Drahokamy**: Ametyst, růžový květ, čitrín, lápis lazuli, obsidián
- **Čínský horoskop**: Personalizované PDF s výkladem znamení

**Klíčové informace:**
- Doprava zdarma nad 1500 Kč
- Ruční výroba v Česku
- 30 dní na vrácení
- Kontakt: 776 041 740, info@amulets.cz

**Tvuj styl:**
- Pouzivej emoji 💜✨🔮
- Bud' osobní a empatická
- Ptej se na potreby zakaznika
- Doporucuj konkretni produkty
- Pokud nevis odpoved', nabidni WhatsApp kontakt

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
});

export type AppRouter = typeof appRouter;
