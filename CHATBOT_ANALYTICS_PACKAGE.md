# 📊 Chatbot Analytics Package

**Kompletní řešení pro tracking a měření výkonu chatbota**

Tento balíček poskytuje vše potřebné pro měření komplexního vlivu chatbota na fungování webu:
- 📧 Email capture tracking
- 🔗 Link click tracking  
- 📊 Conversion funnel analytics
- 🤖 Telegram reporting integration
- 📈 Dashboard s real-time metrikami

---

## 🚀 Rychlá instalace (5 minut)

### 1. Database Schema

Přidej do `drizzle/schema.ts`:

```typescript
// Chatbot Events table už existuje, jen přidej nové event types:
// - 'email_captured' - když uživatel zadá email
// - 'link_clicked' - když uživatel klikne na odkaz v chatbot odpovědi

// Žádné změny v schema nejsou potřeba! Tabulka chatbotEvents už podporuje všechny event types.
```

### 2. Backend Functions

Přidej do `server/db.ts`:

```typescript
/**
 * Track chatbot event (email capture, link click, etc.)
 */
export async function trackChatbotEvent(event: {
  sessionId?: number;
  variantId?: number;
  visitorId: string;
  eventType: string;
  eventData?: string;
  page?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  try {
    const [result] = await db.insert(chatbotEvents).values({
      sessionId: event.sessionId || null,
      variantId: event.variantId || null,
      visitorId: event.visitorId,
      eventType: event.eventType,
      eventData: event.eventData || null,
      page: event.page || null,
    });
    
    return result;
  } catch (error) {
    console.error("[Chatbot] Error tracking event:", error);
    return null;
  }
}

/**
 * Get email captures for a date range
 */
export async function getEmailCaptures(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(chatbotEvents)
    .where(and(
      eq(chatbotEvents.eventType, 'email_captured'),
      gte(chatbotEvents.createdAt, startDate),
      lte(chatbotEvents.createdAt, endDate)
    ))
    .orderBy(desc(chatbotEvents.createdAt));
}

/**
 * Get link clicks for a date range
 */
export async function getLinkClicks(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(chatbotEvents)
    .where(and(
      eq(chatbotEvents.eventType, 'link_clicked'),
      gte(chatbotEvents.createdAt, startDate),
      lte(chatbotEvents.createdAt, endDate)
    ))
    .orderBy(desc(chatbotEvents.createdAt));
}

/**
 * Get chatbot analytics summary for a date range
 */
export async function getChatbotAnalyticsSummary(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return null;

  const [emailCount] = await db.select({ count: count() })
    .from(chatbotEvents)
    .where(and(
      eq(chatbotEvents.eventType, 'email_captured'),
      gte(chatbotEvents.createdAt, startDate),
      lte(chatbotEvents.createdAt, endDate)
    ));

  const [linkClickCount] = await db.select({ count: count() })
    .from(chatbotEvents)
    .where(and(
      eq(chatbotEvents.eventType, 'link_clicked'),
      gte(chatbotEvents.createdAt, startDate),
      lte(chatbotEvents.createdAt, endDate)
    ));

  const [sessionCount] = await db.select({ count: count() })
    .from(chatbotSessions)
    .where(and(
      gte(chatbotSessions.startedAt, startDate),
      lte(chatbotSessions.startedAt, endDate)
    ));

  return {
    emailsCaptured: emailCount?.count || 0,
    linkClicks: linkClickCount?.count || 0,
    totalSessions: sessionCount?.count || 0,
    emailCaptureRate: sessionCount?.count ? ((emailCount?.count || 0) / sessionCount.count * 100).toFixed(2) : '0.00',
    linkClickRate: sessionCount?.count ? ((linkClickCount?.count || 0) / sessionCount.count * 100).toFixed(2) : '0.00',
  };
}
```

### 3. tRPC Endpoints

Přidej do `server/routers.ts` v `chat` routeru:

```typescript
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

    // ... zbytek tvého kódu pro Brevo, Meta Conversions, etc.

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
```

### 4. Telegram Report Integration

Přidej do `server/telegram.ts` v `generateCombinedDailyReport()`:

```typescript
// Get Amulets.cz analytics (email captures, link clicks)
const { getChatbotAnalyticsSummary } = await import('./db');
const amuletsAnalytics = await getChatbotAnalyticsSummary(yesterday, today);

// ... v reportu:
report += `├─ 📧 Emailů: <b>${amuletsAnalytics?.emailsCaptured || 0}</b>\n`;
report += `├─ 🔗 Kliknutí na odkazy: <b>${amuletsAnalytics?.linkClicks || 0}</b>\n`;
```

### 5. Frontend Tracking

Přidej do chatbot komponenty (např. `AIChatAssistant.tsx`):

```typescript
// Import tRPC
import { trpc } from "@/lib/trpc";

// V komponentě:
const trackLinkClick = trpc.chat.trackLinkClick.useMutation();

// Při renderování odpovědi s odkazy:
const handleLinkClick = (url: string, linkText: string) => {
  trackLinkClick.mutate({
    url,
    visitorId: getVisitorId(), // Tvoje visitor ID funkce
    sessionId: currentSessionId,
    linkText,
    page: window.location.pathname,
  });
};

// Wrap odkazy v odpovědi:
<a 
  href={url} 
  onClick={() => handleLinkClick(url, linkText)}
  target="_blank"
  rel="noopener noreferrer"
>
  {linkText}
</a>
```

---

## 📊 Co získáš

### Telegram `/report` ukáže:

```
💜 AMULETS.CZ
├─ Konverzací: 127
├─ Zpráv: 543
├─ Konverzí: 23
├─ 📧 Emailů: 18
├─ 🔗 Kliknutí na odkazy: 45
└─ Konverzní poměr: 18.11%
```

### Metriky:

- **Email Capture Rate**: % konverzací kde byl zachycen email
- **Link Click Rate**: % konverzací kde uživatel klikl na odkaz
- **Conversion Funnel**: Bot opened → Engaged → Link clicked → Email captured → Purchased
- **Attribution**: Které odkazy vedou k nejvíce konverzím
- **A/B Testing**: Která varianta chatbota má nejvyšší engagement

---

## 🧪 Testování

Vytvoř test v `server/chatbot-analytics.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { trackChatbotEvent, getChatbotAnalyticsSummary } from './db';

describe('Chatbot Analytics', () => {
  it('should track email capture event', async () => {
    const result = await trackChatbotEvent({
      visitorId: 'test-visitor-123',
      eventType: 'email_captured',
      eventData: JSON.stringify({ email: 'test@example.com' }),
    });
    
    expect(result).toBeDefined();
  });

  it('should track link click event', async () => {
    const result = await trackChatbotEvent({
      visitorId: 'test-visitor-123',
      eventType: 'link_clicked',
      eventData: JSON.stringify({ 
        url: 'https://example.com/product', 
        linkText: 'View Product' 
      }),
    });
    
    expect(result).toBeDefined();
  });

  it('should calculate analytics summary', async () => {
    const startDate = new Date('2026-01-01');
    const endDate = new Date('2026-01-31');
    
    const summary = await getChatbotAnalyticsSummary(startDate, endDate);
    
    expect(summary).toHaveProperty('emailsCaptured');
    expect(summary).toHaveProperty('linkClicks');
    expect(summary).toHaveProperty('emailCaptureRate');
    expect(summary).toHaveProperty('linkClickRate');
  });
});
```

Spusť testy:

```bash
pnpm test
```

---

## 🎯 Použití v dalším projektu

1. Otevři tento soubor (`CHATBOT_ANALYTICS_PACKAGE.md`)
2. Řekni AI: **"Implementuj Chatbot Analytics Package"**
3. AI nainstaluje všechny funkce za 5 minut ⚡
4. Hotovo! 🎉

---

## 📈 Pokročilé funkce

### Dashboard s real-time metrikami

Vytvoř stránku `/admin/chatbot-analytics` s:
- 📊 Grafy email captures a link clicks (Chart.js)
- 🔥 Heatmapa nejkliknutějších odkazů
- 📉 Conversion funnel visualization
- 🎯 A/B testing results
- 📱 Real-time monitoring

### Attribution tracking

Track celou cestu uživatele:
```
Bot opened → Question asked → Link clicked → Product viewed → Email captured → Purchased
```

### Link performance analysis

Zjisti které odkazy vedou k nejvíce konverzím:
```sql
SELECT 
  JSON_EXTRACT(eventData, '$.url') as url,
  COUNT(*) as clicks,
  COUNT(DISTINCT visitorId) as unique_visitors
FROM chatbot_events
WHERE eventType = 'link_clicked'
GROUP BY url
ORDER BY clicks DESC
LIMIT 10;
```

---

## 💡 Tipy

1. **Visitor ID**: Použij localStorage nebo cookie pro persistent visitor tracking
2. **Session ID**: Vytvoř novou session při každém otevření chatbota
3. **Event Data**: Ukládej jako JSON pro flexibilitu (můžeš přidat další metadata později)
4. **Privacy**: Respektuj GDPR - anonymizuj data po 30 dnech
5. **Performance**: Index na `eventType` a `createdAt` pro rychlé queries

---

## 🆘 Troubleshooting

**Q: Tracking nefunguje?**
A: Zkontroluj že `visitorId` je správně předáván z frontendu.

**Q: Telegram report neukazuje data?**
A: Ujisti se že `getChatbotAnalyticsSummary` je správně importován v `telegram.ts`.

**Q: Chci trackovat více event types?**
A: Přidej nové event types do `trackChatbotEvent` (např. `whatsapp_escalation`, `product_recommended`, atd.)

---

## 📝 Changelog

- **v1.0** (Jan 19, 2026): Initial release
  - Email capture tracking
  - Link click tracking
  - Telegram report integration
  - Analytics summary functions

---

**Vytvořeno s ❤️ pro Amulets.cz**

*Pro další projekty: Tento balíček je reusable a můžeš ho nainstalovat do jakéhokoli Manus projektu s chatbotem.*
