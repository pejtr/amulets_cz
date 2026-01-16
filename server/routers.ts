import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { addBrevoContact, sendDiscountWelcomeEmail } from "./brevo";
import { sendHoroscopePDFEmail } from "./sendHoroscopePDF";
import { sendLeadEvent } from "./meta-conversions";

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
  }),
});

export type AppRouter = typeof appRouter;
